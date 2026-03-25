export type LeaderboardType = "team" | "individual";
export type LeaderboardMetric = "registrations";

export type LeaderboardRow = {
  id: string;
  name: string;
  registrations: number;
};

export type ContactInfo = {
  organizerName: string;
  address: string;
  phone: string;
  email: string;
  devName: string;
  devCompany: string;
  moreLinkHref: string;
};
