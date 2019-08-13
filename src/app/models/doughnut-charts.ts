export interface IDoughnutColors {
  ppc: {
    end: { value: string, bkg: string, label: string },
    start: { value: string, bkg: string, label: string }
  };
  email: {
    end: { value: string, bkg: string, label: string },
    start: { value: string, bkg: string, label: string }
  };
  banners: {
    end: { value: string, bkg: string, label: string },
    start: { value: string, bkg: string, label: string }
  };
  thirdParty: {
    end: { value: string, bkg: string, label: string },
    start: { value: string, bkg: string, label: string }
  };
}

export interface IDoughnutDataRecord {
  label: string;
  value: string;
  prev: string;
}
