import jsPDF from "jspdf";

const downloadPDF = (agreement: any) => {
  const doc = new jsPDF();

  // Colors
  const primaryColor = [41, 128, 185]; // Blue
  const secondaryColor = [44, 62, 80]; // Dark Gray
  const dividerColor = [189, 195, 199]; // Light Gray

  // Margins
  const leftMargin = 20;
  const rightMargin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxWidth = pageWidth - leftMargin - rightMargin;
  const AgrmntOwner = agreement.owner.name.toUpperCase();
  const AgrmntTenant = agreement.tenant.name.toUpperCase();

  console.log(AgrmntOwner);
  
  let yPos = 25;

  // ====== HEADER ======
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("RENTAL AGREEMENT", pageWidth / 2, yPos, { align: "center" });

  yPos += 10;
  doc.setDrawColor(dividerColor[0], dividerColor[1], dividerColor[2]);
  doc.setLineWidth(1);
  doc.line(leftMargin, yPos, pageWidth - rightMargin, yPos);
  yPos += 15;

  // ====== AGREEMENT DETAILS ======
  doc.setFillColor(230, 240, 250); // Light blue background
  doc.rect(leftMargin, yPos - 8, pageWidth - leftMargin - rightMargin, 10, "F");

  doc.setFontSize(14);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text("AGREEMENT DETAILS", leftMargin + 2, yPos);
  yPos += 12;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);

  const agreementDetails = [
    `Property: ${agreement.property.title}`,
    `Location: ${agreement.property.city}`,
    `Effective From: ${new Date(agreement.startDate).toLocaleDateString("en-IN")}`,
    `Valid Until: ${new Date(agreement.endDate).toLocaleDateString("en-IN")}`,
    `Monthly Rent: ${agreement.rentAmount.toLocaleString("en-IN")}`,
    `Security Deposit: ${agreement.fixedDeposit.toLocaleString("en-IN")}`,
  ];

  agreementDetails.forEach((detail) => {
    doc.text(detail, leftMargin + 5, yPos);
    yPos += 7;
  });

  yPos += 12;

  // ====== TERMS AND CONDITIONS ======
  doc.setFillColor(240, 240, 240); // Gray background
  doc.rect(leftMargin, yPos - 8, pageWidth - leftMargin - rightMargin, 10, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("TERMS AND CONDITIONS", leftMargin + 2, yPos);

  yPos += 12;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);

  const mainText = `This Rental Agreement (Agreement) is entered into on ${new Date().toLocaleDateString(
    "en-IN"
  )} between  ${AgrmntOwner} (Owner) and  ${
    AgrmntTenant
  } (Tenant), for the rental of the property known as "${
    agreement.property.title
  }" located at ${agreement.property.city}.

The Parties in the agreement  has to agree the conditions as follows.
1. PROPERTY: The Owner agrees to rent to the Tenant the property described above, including all fixtures and appliances therein.

2. TERM: This lease shall commence on ${new Date(
    agreement.startDate
  ).toLocaleDateString("en-IN")} and shall continue until ${new Date(
    agreement.endDate
  ).toLocaleDateString("en-IN")}, unless terminated earlier.

3. RENT: The monthly rent shall be ${agreement.rentAmount.toLocaleString(
    "en-IN"
  )}, payable in advance on the first day of each month.

4. SECURITY DEPOSIT: Tenant has deposited ${agreement.fixedDeposit.toLocaleString(
    "en-IN"
  )} as security. This deposit shall be refunded upon termination, subject to deductions.`;
  
  const splitText = doc.splitTextToSize(mainText, maxWidth);
  doc.text(splitText, leftMargin, yPos);
  yPos += splitText.length * 5 + 15;

  // ====== PARTY DETAILS ======
  doc.setFillColor(230, 240, 250);
  doc.rect(leftMargin, yPos - 8, pageWidth - leftMargin - rightMargin, 10, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text("PARTY DETAILS", leftMargin + 2, yPos);
  yPos += 12;

  // Owner
  doc.setFontSize(12);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("OWNER/LANDLORD:", leftMargin, yPos);
  yPos += 7;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text(`Name: ${agreement.owner.name}`, leftMargin + 10, yPos);
  yPos += 6;
  doc.text(`Email: ${agreement.owner.email}`, leftMargin + 10, yPos);
  yPos += 6;

  // Tenant
  yPos += 5;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("TENANT:", leftMargin, yPos);
  yPos += 7;

  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  doc.text(`Name: ${agreement.tenant.name}`, leftMargin + 10, yPos);
  yPos += 6;
  doc.text(`Email: ${agreement.tenant.email}`, leftMargin + 10, yPos);
  yPos += 6;

  // ====== FOOTER ======
    const pageCount = doc.internal.pages.length-1;

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    // divider line
    doc.setDrawColor(dividerColor[0], dividerColor[1], dividerColor[2]);
    doc.setLineWidth(0.5);
    doc.line(leftMargin, pageHeight - 20, pageWidth - rightMargin, pageHeight - 20);

    // footer text
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(100);

    doc.text(`Page ${i} of ${pageCount}`, pageWidth - rightMargin, pageHeight - 10, { align: "right" });
  }

  // Save file
  doc.save(
    `Rental_Agreement_${agreement.id}_${agreement.property.title.replace(
      /[^a-zA-Z0-9]/g,
      "_"
    )}.pdf`
  );
};

export default downloadPDF;