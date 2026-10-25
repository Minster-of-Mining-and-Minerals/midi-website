// types/strategy.ts

export interface CoreValue {
  value_id?: string; // optional for creation
  section_id?: string;
  title: string;
  icon?: string | null;
  content?: string | null;
  title_am?: string | null;
  content_am?: string | null;
  display_order?: number;
}

export interface StrategySection {
  section_id?: string; // optional for creation
  strategy_id?: string;
  type: "mission" | "vision" | "core_values";
  title: string;
  icon?: string | null;
  content?: string | null;
  content_am?: string | null;
  attachment_id?: string | null;
  core_values?: CoreValue[]; // only used if type === "core_values"
}

export interface Strategy {
  strategy_id: string;
  title: string;
  description?: string | null;
  title_am?: string | null;
  description_am?: string | null;
  created_at: string;
  updated_at: string;
  sections?: StrategySection[];
}

// Payload for creating a strategy
export interface CreateStrategyPayload {
  title: string;
  description?: string | null;
  title_am?: string | null;
  description_am?: string | null;
  sections?: StrategySection[];
}

// Payload for updating a strategy
export interface UpdateStrategyPayload {
  title?: string;
  description?: string | null;
  title_am?: string | null;
  description_am?: string | null;
  sections?: StrategySection[];
}
