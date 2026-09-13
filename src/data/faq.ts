export interface FaqItem {
  q: string;
  a: string;
}

export const faqItems: FaqItem[] = [
  {
    q: 'What are typical lead times?',
    a: 'Ready-made catalog items usually ship in 5–10 business days. Custom prints take 7–21 business days depending on size, material, and current queue. You will get a clearer timeline when invoiced.',
  },
  {
    q: 'Which materials do you print in?',
    a: 'Primarily PLA and PETG for props and figurines, with ABS, TPU, and resin available for suitable designs. Material choice affects strength, flexibility, and finish — we can advise on your order request.',
  },
  {
    q: 'What file formats do you accept?',
    a: 'STL is preferred for custom orders. You can upload a binary STL here for an instant volume estimate, or paste a Google Drive / Dropbox / WeTransfer link. ASCII STL and other formats are fine via link + notes.',
  },
  {
    q: 'How does the in-browser quote work?',
    a: 'For binary STL files we estimate solid volume from the mesh, apply your chosen infill and material density, then price against configurable rates. Quotes are approximate — final invoice may adjust for supports, orientation, or finishing.',
  },
  {
    q: 'Do you ship internationally?',
    a: 'Yes. Shipping is calculated when we invoice, based on destination, package size, and weight. Include your shipping country on the order request.',
  },
  {
    q: 'Are replica katanas and blades real weapons?',
    a: 'No. All blades, daggers, and similar items are cosplay / display prop replicas made of plastic. They are blunt, decorative, and not functional weapons. See Policies for the full disclaimer.',
  },
  {
    q: 'Can I request a painted finish?',
    a: 'Basic color filament is included in catalog pricing. Hand painting or weathering can be requested in the notes — we will quote finishing separately if we can take it on.',
  },
  {
    q: 'What happens after I submit an order request?',
    a: 'You will receive a confirmation path (email/form). Sidhartha reviews the request, confirms feasibility, and sends an invoice with final pricing and shipping. Payment is arranged at that stage — no card is charged on this site.',
  },
];
