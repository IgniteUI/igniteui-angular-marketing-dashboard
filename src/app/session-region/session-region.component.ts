import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef } from '@angular/core';
import { DataService } from '../data.service';
import { IgxGeographicMapComponent } from 'igniteui-angular-maps/ES5/igx-geographic-map-component';
import { IgxGeographicProportionalSymbolSeriesComponent
} from 'igniteui-angular-maps/ES5/igx-geographic-proportional-symbol-series-component';
import { IgxGeographicShapeSeriesComponent
} from 'igniteui-angular-maps/ES5/igx-geographic-shape-series-component';
import { ShapeDataSource } from 'igniteui-angular-core/ES5/igx-shape-data-source';
import { IGeographicShapeSeries, IMapData, IGeographicProportionalSymbolSeries } from '../models/map';
import { IRangeData } from '../models/range';
import { Visibility } from 'igniteui-angular-core/ES5/Visibility';
import { SeriesCollection, Series } from 'igniteui-angular-charts/ES5/SeriesViewer_combined';
import { MarkerType } from 'igniteui-angular-charts/ES5/MarkerType';
import { IgxSizeScaleComponent } from 'igniteui-angular-charts/ES5/igx-size-scale-component';
import { IgxLinearProgressBarComponent } from 'igniteui-angular';

@Component({
  selector: 'app-session-region',
  templateUrl: './session-region.component.html',
  styleUrls: ['./session-region.component.scss']
})
export class SessionByRegionComponent implements OnInit, AfterViewInit {

  constructor( private service: DataService) {
    this.shapeSeriesModel = {
                    name: 'world',
                    shapeDataSource: '../../assets/world.shp',
                    databaseSource: '../../assets/world.dbf',
                    brush: '#6F6B75',
                    outline: '#67626E'
    };

    this.proportionalSymbolModel = {
                    name: 'countryTraffic',
                    latitudeMemberPath: 'latitude',
                    longitudeMemberPath: 'longitude',
                    markerType: MarkerType.Circle,
                    radiusMemberPath: 'scaledSessions',
                    markerOutline: '#ffff33',
                    markerBrush: '#ffff33'
    };

   }
  public mapData: IMapData;
  public shapeSeriesModel: IGeographicShapeSeries;
  public proportionalSymbolModel: IGeographicProportionalSymbolSeries;
  public inProgressMode = false;
  public range: number;
  public interval: any;

  @ViewChild('map', {static: true})
    public map: IgxGeographicMapComponent;

    @ViewChild('template', {static: false})
    public toolTipTemplate: TemplateRef<any>;

    @ViewChild(IgxLinearProgressBarComponent, {static: false})
    public linearBar: IgxLinearProgressBarComponent;

  ngOnInit() {
    this.service.onDataFetch.subscribe((data: IRangeData) => {
      this.inProgressMode = false;
      if (this.interval) {
        this.interval = window.clearInterval(this.interval);
      }
      this.linearBar.value = 0;

      this.mapData = {
        start: data.start,
        end: data.end,
        mapCurrent: data.end.trafficStats[0]
      };
      this.mapData.mapCurrent['current'] = 0;
      this.range = data.end.trafficStats.length - 1;
      this.generateMapData(this.map);

    });
  }

  ngAfterViewInit() {

  }

  public generateMapSeries(shape: IGeographicShapeSeries, proportionalS: IGeographicProportionalSymbolSeries): any[] {
      const shapeSeries = new IgxGeographicShapeSeriesComponent();
      shapeSeries.name = shape.name;
      shapeSeries.shapeDataSource = shape.shapeDataSource;
      shapeSeries.databaseSource = shape.databaseSource;
      shapeSeries.brush = shape.brush;
      shapeSeries.outline = shape.outline;


      const sizeScale = new IgxSizeScaleComponent();
      sizeScale.minimumValue = 4;
      sizeScale.maximumValue = 60;

      const proportionalSymbol = new IgxGeographicProportionalSymbolSeriesComponent();
      proportionalSymbol.radiusScale = sizeScale;
      proportionalSymbol.name = proportionalS.name;
      proportionalSymbol.latitudeMemberPath = proportionalS.latitudeMemberPath;
      proportionalSymbol.longitudeMemberPath = proportionalS.longitudeMemberPath;
      proportionalSymbol.markerType = proportionalS.markerType;
      proportionalSymbol.radiusMemberPath = proportionalS.radiusMemberPath;
      proportionalSymbol.markerOutline = proportionalS.markerOutline;
      proportionalSymbol.tooltipTemplate = this.toolTipTemplate;
      return [shapeSeries, proportionalSymbol];
  }

  public generateMapData(map: IgxGeographicMapComponent): void {
    map.width = '100%';
    map.height = '450px';
    map.zoomable = false;
    map.dataSource = this.mapData.mapCurrent.perLocation;
    map.windowRect = { left: 0, top: 0, height: 0.7, width: 0.7 };
    map.crosshairVisibility = Visibility.Collapsed;
    map.backgroundContent = null;
    this.generateMapSeries(this.shapeSeriesModel, this.proportionalSymbolModel).forEach( s => {
      map.series.add(s);
    });
  }

  public toggleUpdate(event) {
    this.inProgressMode = this.inProgressMode ? false : true;
    if (this.inProgressMode) {
        this.interval = window.setInterval( () => {
          if (++this.mapData.mapCurrent.current >= this.mapData.end.trafficStats.length) {
              this.mapData.mapCurrent.current = 0;
          }
          this.linearBar.value = this.mapData.mapCurrent.current;
          this.updateMapData(this.mapData.end.trafficStats[this.mapData.mapCurrent.current].perLocation);
      }, 1000);
    } else {
      this.interval = window.clearInterval(this.interval);
    }
  }

  public updateMapData(data: any) {
    const currentMapData = this.mapData.mapCurrent.perLocation;
    const newMapData = this.mapData.mapCurrent.perLocation;
    for (let i = 0; i < currentMapData.length; i++) {
      newMapData[i].scaledSessions = data[i].scaledSessions;
      newMapData[i].session = data[i].session;
      this.map.notifySetItem(currentMapData, i, currentMapData[i], newMapData[i]);
    }
  }

}
