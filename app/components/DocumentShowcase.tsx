"use client"

import { useState } from 'react'

type Example = {
  id: string
  label: string
  title: string
  capability: string
  why: string
  image: string
  html: string
}

const examples: Example[] = [
  {
    "id": "statement",
    "label": "Statement",
    "title": "Statement",
    "capability": "Transaction tables and repeated row structure",
    "why": "Preserves rows and columns so downstream extraction can validate transactions instead of guessing from plain text.",
    "image": "/images/hostable-ocr/showcase/statement.png",
    "html": "<section class=\"ocr-section\"><h4>Bonus Credits</h4><table border=\"1\">\n<thead>\n<tr>\n<th>DATE</th>\n<th>DESCRIPTION</th>\n<th>AMOUNT</th>\n</tr>\n</thead>\n<tbody>\n<tr><td>01/16/2025</td><td>Transfer from Loan</td><td>$ 892.00</td></tr>\n<tr><td>01/16/2025</td><td>Payroll</td><td>976.00</td></tr>\n<tr><td>01/17/2025</td><td>Government Relief</td><td>643.00</td></tr>\n<tr><td>01/18/2025</td><td>Loyalty Rewards</td><td>710.00</td></tr>\n<tr><td>01/19/2025</td><td>Rebate Credit</td><td>932.00</td></tr>\n<tr><td>01/19/2025</td><td>Interest Earned</td><td>362.00</td></tr>\n<tr><td>01/22/2025</td><td>Transfer from Loan</td><td>266.00</td></tr>\n<tr><td>01/22/2025</td><td>Transfer from Loan</td><td>143.00</td></tr>\n<tr><td>01/23/2025</td><td>Cashback Credit</td><td>821.00</td></tr>\n<tr><td>01/24/2025</td><td>Refund for Returned Item</td><td>582.00</td></tr>\n<tr><td>01/25/2025</td><td>Transfer from Loan</td><td>512.00</td></tr>\n<tr><td>01/26/2025</td><td>Rebate Credit</td><td>195.00</td></tr>\n<tr><td>01/29/2025</td><td>Intuit 94054083</td><td>758.00</td></tr>\n<tr><td>01/29/2025</td><td>Promotional Bonus</td><td>268.00</td></tr>\n<tr><td>01/29/2025</td><td>Government Relief</td><td>210.00</td></tr>\n<tr><td>01/29/2025</td><td>Overpayment Refund</td><td>113.00</td></tr>\n<tr><td>01/30/2025</td><td>Bank Adjustment Credit</td><td>911.00</td></tr>\n<tr><td>01/30/2025</td><td>Interest Earned</td><td>175.00</td></tr>\n<tr><td>01/31/2025</td><td>Rebate Credit</td><td>772.00</td></tr>\n<tr><td>02/03/2025</td><td>Government Relief</td><td>408.00</td></tr>\n<tr><td>02/03/2025</td><td>Interest Earned</td><td>687.00</td></tr>\n<tr><td>02/03/2025</td><td>Deposit/Credit</td><td>753.00</td></tr>\n<tr><td>02/04/2025</td><td>Loyalty Rewards</td><td>406.00</td></tr>\n<tr><td>02/04/2025</td><td>Travel Refund</td><td>483.00</td></tr>\n<tr><td>02/07/2025</td><td>Overpayment Refund</td><td>38.00</td></tr>\n<tr><td>02/08/2025</td><td>Dividend Payment</td><td>391.00</td></tr>\n<tr><td>02/09/2025</td><td>Bank Adjustment Credit</td><td>295.00</td></tr>\n<tr><td>02/10/2025</td><td>Bank Adjustment Credit</td><td>199.00</td></tr>\n<tr><td>02/10/2025</td><td>Loyalty Rewards</td><td>457.00</td></tr>\n<tr><td>02/12/2025</td><td>Interest Earned</td><td>121.00</td></tr>\n<tr><td>02/13/2025</td><td>Cashback Credit</td><td>223.00</td></tr>\n</tbody>\n</table></section>\n<section class=\"ocr-section\"><h4>Funds Deduction</h4><table border=\"1\">\n<thead>\n<tr>\n<th>DATE</th>\n<th>DESCRIPTION</th>\n<th>AMOUNT</th>\n</tr>\n</thead>\n<tbody>\n<tr><td>01/15/2025</td><td>Payment</td><td>$ 713.00</td></tr>\n<tr><td>01/15/2025</td><td>Bofk, NA</td><td>553.00</td></tr>\n<tr><td>01/18/2025</td><td>Auth Payme</td><td>804.00</td></tr>\n<tr><td>01/18/2025</td><td>Check</td><td>884.00</td></tr>\n<tr><td>01/20/2025</td><td>Amex Payment</td><td>349.00</td></tr>\n<tr><td>01/22/2025</td><td>Kubota Credit</td><td>182.00</td></tr>\n<tr><td>01/22/2025</td><td>Tran Fee Intuit</td><td>357.00</td></tr>\n<tr><td>01/23/2025</td><td>Check</td><td>83.00</td></tr>\n<tr><td>01/23/2025</td><td>Auth Payme</td><td>966.00</td></tr>\n<tr><td>01/24/2025</td><td>Intuit 43174740</td><td>483.00</td></tr>\n<tr><td>01/25/2025</td><td>Taxdrafts</td><td>983.00</td></tr>\n<tr><td>01/26/2025</td><td>Amex Payment</td><td>686.00</td></tr>\n<tr><td>01/31/2025</td><td>Tran Fee Intuit</td><td>439.00</td></tr>\n<tr><td>01/31/2025</td><td>Amex Epayment</td><td>773.00</td></tr>\n<tr><td>02/02/2025</td><td>Intuit 43174740</td><td>863.00</td></tr>\n<tr><td>02/02/2025</td><td>Tran Fee Intuit</td><td>659.00</td></tr>\n<tr><td>02/04/2025</td><td>Intuit 43174740</td><td>40.00</td></tr>\n<tr><td>02/04/2025</td><td>Bofk, NA</td><td>247.00</td></tr>\n<tr><td>02/06/2025</td><td>Tran Fee Intuit</td><td>432.00</td></tr>\n<tr><td>02/06/2025</td><td>Kubota Credit</td><td>509.00</td></tr>\n<tr><td>02/06/2025</td><td>Kubota Credit</td><td>609.00</td></tr>\n<tr><td>02/07/2025</td><td>Bofk, NA</td><td>733.00</td></tr>\n<tr><td>02/08/2025</td><td>Debit Card</td><td>80.00</td></tr>\n<tr><td>02/08/2025</td><td>Kansas Payment</td><td>541.00</td></tr>\n<tr><td>02/09/2025</td><td>Auth Payme</td><td>412.00</td></tr>\n<tr><td>02/12/2025</td><td>ATM</td><td>982.00</td></tr>\n<tr><td>02/13/2025</td><td>ACH Payment</td><td>719.00</td></tr>\n<tr><td>02/13/2025</td><td>Kansas Payment</td><td>427.00</td></tr>\n<tr><td>02/13/2025</td><td>Transfer to Loan</td><td>111.00</td></tr>\n</tbody>\n</table></section>"
  },
  {
    "id": "cheque",
    "label": "Cheque",
    "title": "Cheque",
    "capability": "Spatial key-value layout",
    "why": "Cheques are not tables. The output keeps payee, amount, date, memo, and bank text as separate layout regions.",
    "image": "/images/hostable-ocr/showcase/cheque.png",
    "html": "<div data-bbox=\"43 98 158 154\" data-label=\"Text\"><p>Magali Kuphal<br/>977 W Broadway Street<br/>New Wilmaston, South Dakota 39810</p></div><div data-bbox=\"210 97 304 136\" data-label=\"Image\"><img alt=\"CHASE logo\"/></div><div data-bbox=\"43 170 468 438\" data-label=\"Text\"><p>PAY TO THE ORDER OF <u>2025-02-13</u><br/><u>Jacobi Inc</u> <span style=\"border: 1px solid black; padding: 2px;\">$3,176.94</span><br/><u>Three Thousand One Hundred Seventy Six and 94/100</u> DOLLARS<br/>MEMO <u>Contract payment</u><br/>: 2 2 8 7 6 7 3 4 9 : 6 2 7 9 4 6 3 6 8 : 1 7 2 9 :</p></div><div data-bbox=\"522 98 619 154\" data-label=\"Text\"><p>Jennifer Lang<br/>65760 Farrell Manors<br/>Lonview, Montana 09556-7352</p></div><div data-bbox=\"651 97 818 136\" data-label=\"Image\"><img alt=\"BANK OF AMERICA logo\"/></div><div data-bbox=\"522 170 950 438\" data-label=\"Text\"><p>PAY TO THE ORDER OF <u>2025-02-13</u><br/><u>Rob, Greenfelder and Collins</u> <span style=\"border: 1px solid black; padding: 2px;\">$23,020.43</span><br/><u>Twenty Three Thousand Twenty and 43/100</u> DOLLARS<br/>MEMO <u>Maintenance service</u><br/>: 7 9 7 1 1 3 4 0 5 : 5 2 4 4 3 3 1 5 6 8 : 7 6 5 6 :</p></div><div data-bbox=\"43 557 154 613\" data-label=\"Text\"><p>Wilton Champlin<br/>427 Vern Loaf<br/>Zboncakville, Massachusetts 18783</p></div><div data-bbox=\"174 556 340 595\" data-label=\"Image\"><img alt=\"BANK OF AMERICA logo\"/></div><div data-bbox=\"43 637 468 900\" data-label=\"Text\"><p>PAY TO THE ORDER OF <u>2025-02-12</u><br/><u>Walter, Braun and Toy</u> <span style=\"border: 1px solid black; padding: 2px;\">$26,716.13</span><br/><u>Twenty Six Thousand Seven Hundred Sixteen and 13/100</u> DOLLARS<br/>MEMO <u>Services rendered</u><br/>: 3 9 4 5 8 4 4 3 7 : 5 3 1 3 2 6 4 8 6 5 : 6 1 3 7 :</p></div>"
  },
  {
    "id": "invoice",
    "label": "Invoice",
    "title": "Invoice",
    "capability": "Header fields, line items, and totals",
    "why": "Invoices need mixed understanding: addresses, identifiers, line-item tables, subtotals, tax, and total amount.",
    "image": "/images/hostable-ocr/showcase/invoice.png",
    "html": "<div data-bbox=\"415 87 697 116\" data-label=\"Section-Header\">\n<h1>VAT BILLING STATEMENT</h1>\n</div>\n<div data-bbox=\"700 67 864 133\" data-label=\"Text\">\n<p>Document Number: XTXVZJHTE<br/>\n    Client Number: 466197399<br/>\n    Issue Date: 12-10-1993<br/>\n    Page: 18 of 85</p>\n</div>\n<div data-bbox=\"905 69 946 131\" data-label=\"Image\">\n<img alt=\"UPS logo\"/>\n</div>\n<div data-bbox=\"23 165 977 897\" data-label=\"Table\">\n<table border=\"1\">\n<thead>\n<tr>\n<th>Shipment Number</th>\n<th>Sender / Reference Number</th>\n<th>Date</th>\n<th>Dispatch Station / Sender</th>\n<th>Receiving Station / Recipient</th>\n<th>Type of Service / Charge</th>\n<th>Weight in Kg</th>\n<th>Number of Shipments</th>\n<th>Base Charge</th>\n<th>Description of Additional Charges</th>\n<th>Additional Charges</th>\n<th>VAT / Code</th>\n<th>Gross Value</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td><a href=\"#\">2204291684</a></td>\n<td></td>\n<td>12-18-1954</td>\n<td>BOSCO - KUHN<br/>882 Toy Views<br/>WEST ELLA, 81553</td>\n<td>KAUTZER, AUER<br/>AND ULLRICH<br/>70342 East Avenue<br/>PORTAGE, 31828-<br/>7126</td>\n<td>DOMESTIC<br/>PRIORITY</td>\n<td>21</td>\n<td>10</td>\n<td>179.01</td>\n<td>DANGEROUS GOODS HANDLING FEE</td>\n<td>5.01</td>\n<td>2.81</td>\n<td>11.35</td>\n</tr>\n<tr>\n<td><a href=\"#\">4148668459</a></td>\n<td>UKDFR8GJHW</td>\n<td>10-29-1957</td>\n<td>CRONA, BRADTKE<br/>AND JERDE<br/>18981 Barney Trail<br/>MARIETTA, 00451-<br/>1007</td>\n<td>DOUGLAS AND<br/>SONS<br/>56426 N Broad Street<br/>SOUTH<br/>PEYTONBERG,<br/>44921-4792</td>\n<td>DOMESTIC<br/>PRIORITY</td>\n<td>33.9</td>\n<td>2</td>\n<td>30.81</td>\n<td>CUSTOMS DUTY</td>\n<td>8.39</td>\n<td>4.99</td>\n<td>33.44</td>\n</tr>\n<tr>\n<td></td>\n<td></td>\n<td></td>\n<td></td>\n<td></td>\n<td></td>\n<td></td>\n<td></td>\n<td></td>\n<td>PACKAGING FEE</td>\n<td>8.18</td>\n<td>2.49</td>\n<td>15.5</td>\n</tr>\n<tr>\n<td></td>\n<td></td>\n<td></td>\n<td></td>\n<td></td>\n<td></td>\n<td></td>\n<td></td>\n<td></td>\n<td>SAME-DAY DELIVERY CHARGE</td>\n<td>4.28</td>\n<td>1.13</td>\n<td>13.29</td>\n</tr>\n<tr>\n<td></td>\n<td></td>\n<td></td>\n<td></td>\n<td></td>\n<td></td>\n<td></td>\n<td></td>\n<td></td>\n<td>SPECIAL HANDLING FEE</td>\n<td>5.95</td>\n<td>1.89</td>\n<td>30.32</td>\n</tr>\n<tr>\n<td><a href=\"#\">6150141832</a></td>\n<td>QEQZVQHQRZ</td>\n<td>06-08-1958</td>\n<td>GLOVER -<br/>SWANIAWSKI<br/>72149 E Maple Street<br/>FREDERICK, 64468-<br/>2121</td>\n<td>ROLFSON -<br/>TREMBLAY<br/>372 Center Avenue<br/>EAST CHADRICK,<br/>46081</td>\n<td>EXPRESS<br/>WORLDWIDE</td>\n<td>35.8</td>\n<td>10</td>\n<td>144.52</td>\n<td>CUSTOM PACKAGING FEE</td>\n<td>4.49</td>\n<td>1.7</td>\n<td>16.6</td>\n</tr>\n<tr>\n<td><a href=\"#\">5263130309</a></td>\n<td></td>\n<td>08-29-1986</td>\n<td>RAU, KLEIN AND<br/>ZIEME<br/>43768 Batz Branch<br/>YOUNGSTOWN,<br/>85598-4978</td>\n<td>WILDERMAN,<br/>CHRISTIANSEN AND<br/>SCHAEFER<br/>24486 Cedar Grove<br/>SCHROEDERPORT,<br/>52266-4938</td>\n<td>ECONOMY SELECT</td>\n<td>43.8</td>\n<td>9</td>\n<td>193.76</td>\n<td>INSURANCE PREMIUM</td>\n<td>9.79</td>\n<td>3.99</td>\n<td>25.18</td>\n</tr>\n<tr>\n<td></td>\n<td></td>\n<td></td>\n<td></td>\n<td></td>\n<td></td>\n<td></td>\n<td></td>\n<td></td>\n<td>CHANGE OF ADDRESS FEE</td>\n<td>2.58</td>\n<td>4</td>\n<td>32.57</td>\n</tr>\n<tr>\n<td></td>\n<td></td>\n<td></td>\n<td></td>\n<td></td>\n<td></td>\n<td></td>\n<td></td>\n<td></td>\n<td>HOLIDAY DELIVERY FEE</td>\n<td>1.17</td>\n<td>4</td>\n<td>19.88</td>\n</tr>\n</tbody>\n</table>\n</div>\n<div data-bbox=\"29 919 84 941\" data-label=\"Page-Footer\">\n<p>18 of 85</p>\n</div>"
  },
  {
    "id": "receipt",
    "label": "Receipt",
    "title": "Receipt",
    "capability": "Narrow photo-style receipts",
    "why": "Operational workflows often receive noisy phone captures. The OCR keeps store details, item rows, tax, total, and cashier information.",
    "image": "/images/hostable-ocr/showcase/receipt.png",
    "html": "<div data-bbox=\"151 26 697 74\" data-label=\"Section-Header\"><h1>ECONSAVE</h1></div><div data-bbox=\"802 15 912 66\" data-label=\"Text\"><p>0E</p></div><div data-bbox=\"80 85 820 117\" data-label=\"Text\"><p>ECONSAVE CASH &amp; CARRY (FC) S/B (930311-W)</p></div><div data-bbox=\"205 117 677 146\" data-label=\"Text\"><p>Lot G01, KL Festival City,</p></div><div data-bbox=\"113 146 802 179\" data-label=\"Text\"><p>No. 67 Jln Ibu Kota Tmn Danau Kota, KL</p></div><div data-bbox=\"260 179 640 207\" data-label=\"Text\"><p>Tel : (603) 4148 1027</p></div><div data-bbox=\"75 207 354 234\" data-label=\"Text\"><p>22/03/18 10:17</p></div><div data-bbox=\"468 213 550 236\" data-label=\"Text\"><p>RG:4</p></div><div data-bbox=\"632 215 781 239\" data-label=\"Text\"><p>TX:24382</p></div><div data-bbox=\"217 240 673 269\" data-label=\"Text\"><p>GST Reg No : 001919221760</p></div><div data-bbox=\"180 302 707 330\" data-label=\"Text\"><p>Inv No: 220318/10049/04/24382</p></div><div data-bbox=\"61 346 825 650\" data-label=\"Table\"><table><thead><tr><th></th><th>QTY</th><th>RM</th></tr></thead><tbody><tr><td>ITEM # 9555501403092</td><td></td><td></td></tr><tr><td>(NR)ES CHOICE SOFT</td><td>1</td><td>4.20 $</td></tr><tr><td>ITEM # 9555501400367</td><td></td><td></td></tr><tr><td>(NR)ES ICE COOL MI</td><td>1</td><td><del>0.95</del> $</td></tr><tr><td>SUBTOTAL</td><td></td><td><del>5.15</del></td></tr><tr><td colspan=\"3\">=====</td></tr><tr><td>TOTAL(INCL GST)</td><td></td><td><del>5.15</del></td></tr><tr><td>CASH</td><td></td><td><del>5.20</del></td></tr><tr><td>CHANGE DUE</td><td></td><td>0.05</td></tr></tbody></table></div><div data-bbox=\"130 652 460 677\" data-label=\"Text\"><p>ITEMS PURCHASED: 2</p></div><div data-bbox=\"54 682 667 738\" data-label=\"Text\"><table><tr><td>GST - RATE</td><td>-----</td><td>AMT(RM)</td><td>--</td><td>TAX(RM)</td></tr><tr><td>$</td><td>6%</td><td>4.86</td><td></td><td>0.29</td></tr></table></div><div data-bbox=\"50 772 807 803\" data-label=\"Text\"><p>BANDINGKAN HARGA KAMI</p></div><div data-bbox=\"160 805 683 832\" data-label=\"Text\"><p>Thank You. Please Come Again.</p></div><div data-bbox=\"282 836 578 860\" data-label=\"Text\"><p>PAULINE AK JABAN</p></div><div data-bbox=\"156 864 700 892\" data-label=\"Text\"><p>St:10049 Rg:4 Ch:1010 Tr:24382</p></div><div data-bbox=\"266 895 593 920\" data-label=\"Text\"><p>10:18 22/03/18</p></div>"
  },
  {
    "id": "form",
    "label": "Form",
    "title": "Form",
    "capability": "Sections and filled fields",
    "why": "Forms require layout awareness: labels, filled values, sections, and contact details need to stay connected.",
    "image": "/images/hostable-ocr/showcase/form.png",
    "html": "<div data-bbox=\"340 110 712 142\" data-label=\"Section-Header\"><p><b>2001 CCP Venue Wall Mural Agreement<br/>Information Sheet</b></p></div><div data-bbox=\"166 190 843 225\" data-label=\"Text\"><p>Venue Name: <u>The Hallymoon</u></p></div><div data-bbox=\"166 225 843 255\" data-label=\"Text\"><p>Venue Address: <u>1125 St. Mary St.</u></p></div><div data-bbox=\"166 255 843 277\" data-label=\"Text\"><p>City, State, Zip Code: <u>New Orleans, LA. 70130.</u></p></div><div data-bbox=\"166 285 843 302\" data-label=\"Text\"><p>Venue Owner's Name (contact name): _____</p></div><div data-bbox=\"166 302 843 328\" data-label=\"Text\"><p>Telephone Number: <u>504.522.0599</u></p></div><div data-bbox=\"166 364 374 379\" data-label=\"Section-Header\"><p><b>Checks Made Payable To:</b></p></div><div data-bbox=\"166 379 900 407\" data-label=\"Text\"><p>Name of Licenser (Venue Name, Corporation Name or Individual): <u>Pete and Lou Inc.</u></p></div><div data-bbox=\"166 407 948 432\" data-label=\"Text\"><p>Corporate ID Number or Individual's Social Security Number: <u>PERSONAL/CONFIDENTIAL MATERIAL REDACTED</u></p></div><div data-bbox=\"166 432 843 462\" data-label=\"Text\"><p>Address: <u>1125 St. Mary St.</u></p></div><div data-bbox=\"166 462 843 487\" data-label=\"Text\"><p>City, State, Zip Code: <u>New Orleans, LA 70130.</u></p></div><div data-bbox=\"166 487 843 512\" data-label=\"Text\"><p>Phone Number: <u>504.522.0599</u></p></div><div data-bbox=\"163 574 821 615\" data-label=\"Text\"><p>Contact Person at KBA HQ: Amy Lenihan, Media Supervisor and Mural Program Manager<br/>Phone: 312-799-6130<br/>Email: <a href=\"mailto:alenihan@kba.com\">alenihan@kba.com</a></p></div><div data-bbox=\"938 853 963 940\" data-label=\"Page-Footer\"><p>52579 6824</p></div><div data-bbox=\"222 978 776 996\" data-label=\"Page-Footer\"><p>Source: <a href=\"https://www.industrydocuments.ucsf.edu/docs/zyjj0226\">https://www.industrydocuments.ucsf.edu/docs/zyjj0226</a></p></div>"
  },
  {
    "id": "dense",
    "label": "Dense table",
    "title": "Dense table",
    "capability": "Small-font table with targeted region retry",
    "why": "Dense regions can be re-read independently, then returned as semantic table output.",
    "image": "/images/hostable-ocr/patent-full-page.png",
    "html": "<section class=\"ocr-section\"><h4>U.S. Patent Documents</h4><table><tbody><tr><td>1,164,036</td><td>A</td><td>3/1905</td><td>Wilderman</td></tr><tr><td>1,219,530</td><td>A</td><td>5/1905</td><td>Osinski</td></tr><tr><td>1,350,892</td><td>A</td><td>5/1905</td><td>Keebler</td></tr><tr><td>1,411,156</td><td>A</td><td>5/1905</td><td>Connelly</td></tr><tr><td>1,492,661</td><td>A</td><td>5/1905</td><td>Luettgen</td></tr><tr><td>1,573,748</td><td>A</td><td>6/1905</td><td>O'Conner</td></tr><tr><td>1,633,388</td><td>A</td><td>7/1905</td><td>Ermsen et al.</td></tr><tr><td>1,736,111</td><td>A</td><td>7/1905</td><td>Lakin</td></tr><tr><td>1,824,550</td><td>A</td><td>9/1905</td><td>Jenkins et al.</td></tr><tr><td>1,832,191</td><td>A</td><td>10/1905</td><td>Hill</td></tr><tr><td>1,882,205</td><td>A</td><td>10/1905</td><td>Goldner et al.</td></tr><tr><td>1,920,807</td><td>A</td><td>10/1905</td><td>Rice</td></tr><tr><td>2,021,954</td><td>A</td><td>11/1905</td><td>Lakin</td></tr><tr><td>2,090,072</td><td>A</td><td>11/1905</td><td>Hagenes</td></tr><tr><td>2,168,581</td><td>A</td><td>12/1905</td><td>Armstrong</td></tr><tr><td>2,248,112</td><td>A</td><td>2/1906</td><td>Nicolas</td></tr><tr><td>2,355,106</td><td>A</td><td>3/1906</td><td>Anderson et al.</td></tr><tr><td>2,365,179</td><td>A</td><td>4/1906</td><td>Kertzmann</td></tr><tr><td>2,411,391</td><td>A</td><td>5/1906</td><td>Bogan</td></tr><tr><td>2,504,833</td><td>A</td><td>7/1906</td><td>Koelpin et al.</td></tr><tr><td>2,620,219</td><td>A</td><td>9/1906</td><td>Vandervort</td></tr><tr><td>2,640,342</td><td>A</td><td>11/1906</td><td>Gutmann</td></tr><tr><td>2,789,042</td><td>A</td><td>11/1906</td><td>Gutkowski</td></tr><tr><td>2,823,892</td><td>A</td><td>1/1907</td><td>Koch et al.</td></tr><tr><td>2,971,500</td><td>A</td><td>2/1907</td><td>Roberts</td></tr><tr><td>2,986,313</td><td>A</td><td>3/1907</td><td>Altenwerth et al.</td></tr><tr><td>3,091,487</td><td>A</td><td>4/1907</td><td>Ermsen</td></tr><tr><td>3,203,769</td><td>A</td><td>4/1907</td><td>Homenick</td></tr><tr><td>3,331,812</td><td>A</td><td>5/1907</td><td>Treutel et al.</td></tr><tr><td>3,445,260</td><td>A</td><td>5/1907</td><td>Prohaska et al.</td></tr><tr><td>3,583,953</td><td>A</td><td>7/1907</td><td>Wolff et al.</td></tr><tr><td>3,722,531</td><td>A</td><td>7/1907</td><td>Ortiz et al.</td></tr><tr><td>3,751,960</td><td>A</td><td>9/1907</td><td>Greenfelder et al.</td></tr><tr><td>3,789,883</td><td>A</td><td>10/1907</td><td>Osinski et al.</td></tr><tr><td>3,875,085</td><td>A</td><td>10/1907</td><td>Hayes</td></tr><tr><td>3,994,333</td><td>A</td><td>12/1907</td><td>Schmidt et al.</td></tr><tr><td>4,013,556</td><td>A</td><td>1/1908</td><td>Gleichner et al.</td></tr><tr><td>4,060,530</td><td>A</td><td>3/1908</td><td>Legros et al.</td></tr><tr><td>4,131,373</td><td>A</td><td>4/1908</td><td>Rutherford et al.</td></tr><tr><td>4,155,312</td><td>A</td><td>4/1908</td><td>Rice</td></tr><tr><td>4,191,484</td><td>A</td><td>6/1908</td><td>Stanton et al.</td></tr><tr><td>4,199,184</td><td>A</td><td>7/1908</td><td>Witting</td></tr><tr><td>4,284,474</td><td>A</td><td>7/1908</td><td>Bruen</td></tr><tr><td>4,317,946</td><td>A</td><td>9/1908</td><td>Gutkowski et al.</td></tr><tr><td>4,460,929</td><td>A</td><td>10/1908</td><td>Hackett et al.</td></tr><tr><td>4,575,111</td><td>A</td><td>11/1908</td><td>Heaney</td></tr><tr><td>4,640,516</td><td>A</td><td>12/1908</td><td>O'Kon</td></tr><tr><td>4,647,638</td><td>A</td><td>2/1909</td><td>Cronin et al.</td></tr></tbody></table></section>"
  }
]

export function DocumentShowcase() {
  const [selectedId, setSelectedId] = useState(examples[0].id)
  const [view, setView] = useState<'rendered' | 'raw'>('rendered')
  const selected = examples.find((item) => item.id === selectedId) || examples[0]

  return (
    <div className="document-showcase">
      <div className="document-selector">
        {examples.map((item) => {
          const active = item.id === selected.id
          return (
            <button key={item.id} type="button" onClick={() => { setSelectedId(item.id); setView('rendered') }} className={active ? 'active' : ''}>
              {item.label}
            </button>
          )
        })}
      </div>

      <div className="showcase-card">
        <div className="document-pane">
          <div className="pane-label">Original document</div>
          <img src={selected.image} alt={`${selected.title} sample document`} />
        </div>

        <div className="output-pane">
          <div className="output-header">
            <div>
              <div className="pane-label">OCR output</div>
              <h3>{selected.title}</h3>
            </div>
            <div className="output-tabs">
              <button type="button" className={view === 'rendered' ? 'active' : ''} onClick={() => setView('rendered')}>Rendered OCR</button>
              <button type="button" className={view === 'raw' ? 'active' : ''} onClick={() => setView('raw')}>Raw HTML</button>
            </div>
          </div>

          {view === 'rendered' ? (
            <div className="rendered-ocr-output" dangerouslySetInnerHTML={{ __html: selected.html }} />
          ) : (
            <pre className="raw-html"><code>{selected.html}</code></pre>
          )}

          <div className="capability-note">
            <strong>{selected.capability}</strong>
            <p>{selected.why}</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .document-showcase { margin: 1.5rem 0 2rem; }
        .document-selector { display: flex; gap: 0.45rem; overflow-x: auto; padding: 0.35rem 0 0.85rem; }
        .document-selector button { border: 1px solid rgba(148, 163, 184, 0.35); border-radius: 999px; background: #fff; color: #64748b; cursor: pointer; font: inherit; font-size: 0.88rem; font-weight: 650; padding: 0.48rem 0.82rem; white-space: nowrap; }
        .document-selector button.active { background: #0f172a; border-color: #0f172a; color: #fff; }
        .showcase-card { display: grid; grid-template-columns: minmax(260px, 0.8fr) minmax(320px, 1.2fr); gap: 1rem; align-items: stretch; }
        .document-pane, .output-pane { border: 1px solid rgba(148, 163, 184, 0.35); border-radius: 16px; background: #fff; overflow: hidden; box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06); }
        .document-pane { padding: 1rem; }
        .document-pane img { display: block; width: 100%; max-height: 640px; object-fit: contain; border-radius: 10px; background: #f8fafc; }
        .pane-label { color: #64748b; font-size: 0.76rem; font-weight: 750; letter-spacing: 0.05em; margin-bottom: 0.65rem; text-transform: uppercase; }
        .output-header { align-items: center; background: #f8fafc; border-bottom: 1px solid rgba(148, 163, 184, 0.24); display: flex; gap: 1rem; justify-content: space-between; padding: 0.9rem 1rem; }
        .output-header h3 { font-size: 1rem; margin: 0; }
        .output-tabs { display: flex; gap: 0.35rem; }
        .output-tabs button { border: 1px solid transparent; border-radius: 10px; background: transparent; color: #64748b; cursor: pointer; font: inherit; font-size: 0.82rem; font-weight: 700; padding: 0.48rem 0.68rem; white-space: nowrap; }
        .output-tabs button.active { background: #fff; border-color: rgba(37, 99, 235, 0.25); color: #0f172a; box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08); }
        .rendered-ocr-output { color: #111827; max-height: 520px; overflow: auto; padding: 1rem; }
        .raw-html { background: #0f172a; color: #e5e7eb; font-size: 0.78rem; line-height: 1.55; margin: 0; max-height: 520px; overflow: auto; padding: 1rem; white-space: pre-wrap; }
        .capability-note { background: #f8fafc; border-top: 1px solid rgba(148, 163, 184, 0.24); padding: 0.9rem 1rem; }
        .capability-note strong { color: #0f172a; display: block; font-size: 0.92rem; margin-bottom: 0.25rem; }
        .capability-note p { color: #475569; font-size: 0.9rem; margin: 0; }
        .rendered-ocr-output :global(.ocr-section) { margin-bottom: 1.25rem; }
        .rendered-ocr-output :global(h4) { font-size: 0.95rem; font-weight: 750; margin: 0 0 0.75rem; }
        .rendered-ocr-output :global(div[data-label]) { border-left: 2px solid rgba(37, 99, 235, 0.2); margin: 0.45rem 0; padding: 0.25rem 0.5rem; }
        .rendered-ocr-output :global(div[data-label]::before) { content: attr(data-label); color: #64748b; display: block; font-size: 0.68rem; font-weight: 750; letter-spacing: 0.05em; margin-bottom: 0.15rem; text-transform: uppercase; }
        .rendered-ocr-output :global(table) { border-collapse: collapse; font-size: 0.82rem; line-height: 1.35; width: 100%; }
        .rendered-ocr-output :global(th), .rendered-ocr-output :global(td) { border: 1px solid rgba(148, 163, 184, 0.45); padding: 0.35rem 0.45rem; vertical-align: top; }
        .rendered-ocr-output :global(th) { background: rgba(148, 163, 184, 0.16); font-weight: 750; }
        .rendered-ocr-output :global(tr:nth-child(even) td) { background: rgba(148, 163, 184, 0.08); }
        .rendered-ocr-output :global(img:not([src])) { display: none; }
        @media (max-width: 820px) { .showcase-card { grid-template-columns: 1fr; } .output-header { align-items: flex-start; flex-direction: column; } }
      `}</style>
    </div>
  )
}
