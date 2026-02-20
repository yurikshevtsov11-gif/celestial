
export interface SourceLink {
  text: string;
  url: string;
}

export interface TelemetryData {
  mass: string;
  gravity: string;
  dayLength: string;
  tempRange: string;
  orbitalVelocity: string;
}

export interface VerifiedFact {
  title: string;
  description: string;
  source: SourceLink;
}

export interface MoonData {
  id: string;
  name: string;
  radius: number;
  distance: number;
  orbitSpeed: number;
  color: string;
  telemetry: Partial<TelemetryData>;
}

export interface PlanetData {
  id: string;
  name: string;
  color: string;
  radius: number;
  distance: number;
  orbitSpeed: number;
  rotationSpeed: number;
  hasRings?: boolean;
  description: string;
  facts: string[];
  verifiedFacts: VerifiedFact[];
  telemetry: TelemetryData;
  moons?: MoonData[];
}

export interface FocusState {
  id: string;
  type: 'planet' | 'moon';
}
