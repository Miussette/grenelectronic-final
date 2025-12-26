// types/project.ts
export type Specs = {
  panelResolution?: { width: number; height: number; unit?: "px" };
  physicalSize?: { width: string; height: string; depth?: string; approx?: boolean };
  ledType?: string;
  pixelPitch?: string;
  controller?: string;
  connectivity?: string[];
  protocol?: string;
  powerInput?: string[];
  maxPower?: string;
  protection?: { front?: string; back?: string };
  warranty?: string;
  softwareIncluded?: string;
};

export type Environment = {
  operatingTemp?: { min: string; max: string };
  humidity?: string;
  cabinet?: string;
};

export type Installation = {
  method?: string;
};

export type Project = {
  slug: string;
  title: string;
  client?: string;
  year?: string;
  industry?: string;
  tags?: string[];
  summary: string;
  cover: string;
  gallery?: string[];

  // 👇 nuevos campos opcionales
  specs?: Specs;
  environment?: Environment;
  installation?: Installation;
  applications?: string[];
  dataExample?: { command?: string; displayOutput?: string; notes?: string };
  datasheetImage?: string;
};
