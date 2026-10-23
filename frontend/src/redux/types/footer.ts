import type { AttachmentLike } from "@/utils/fileUrl";

export interface FooterSectionLink {
  label: string;
  url: string;
}

export interface FooterSection {
  footer_section_id: string;
  footer_id: string;
  section_name: string;
  links: FooterSectionLink[];
  created_at: string;
  updated_at: string;
}

export interface Footer {
  footer_id: string;
  title: string;
  text: string;
  content?: string | null;
  attachment_id?: string | null;
  // Logo file, included in the GET /footer response
  attachment?: AttachmentLike | null;
  sections?: FooterSection[];
  created_at: string;
  updated_at: string;
}

export interface CreateFooterPayload {
  title: string;
  text: string;
  content?: string;
  attachment_id?: string;
  sections?: {
    section_name: string;
    links: FooterSectionLink[];
  }[];
}

export interface UpdateFooterPayload {
  title?: string;
  text?: string;
  // "" clears the content, null removes the logo
  content?: string | null;
  attachment_id?: string | null;
  sections?: {
    footer_section_id?: string;
    section_name: string;
    links: FooterSectionLink[];
  }[];
}

export interface CreateFooterSectionPayload {
  footer_id: string;
  section_name: string;
  links: FooterSectionLink[];
}