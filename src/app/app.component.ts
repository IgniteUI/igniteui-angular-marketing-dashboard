import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IgxDividerComponent } from 'igniteui-angular/directives';
import { CampaignHealthComponent } from './campaign-health/campaign-health.component';
import { CurrentTrendComponent } from './current-trend/current-trend.component';
import { DataChartComponent } from './data-chart/data-chart.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SessionByRegionComponent } from './session-region/session-region.component';
import { SideNavIndicatorsComponent } from './side-nav-indicators/side-nav-indicators.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NavbarComponent,
    CurrentTrendComponent,
    DataChartComponent,
    SessionByRegionComponent,
    CampaignHealthComponent,
    SideNavIndicatorsComponent,
    IgxDividerComponent
  ]
})
export class AppComponent {
  public readonly title = 'marketing-dashboard';
}
