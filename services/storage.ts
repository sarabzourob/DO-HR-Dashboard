
import { Position, Employee, OnboardingTask, HRRequest, SeparationRecord, OnboardingRecord, PerformanceRecord } from '../types';

const KEYS = {
  POSITIONS: 'do_positions_v3',
  EMPLOYEES: 'do_employees_v5', // Bumped to remove test33
  TASKS: 'do_tasks_v3', // Bumped to clear onboarding tasks
  REQUESTS: 'do_requests',
  SEPARATIONS: 'do_separations',
  ONBOARDINGS: 'do_onboardings_v2', // Bumped to clear onboarding records
  PERFORMANCE: 'do_performance',
};

const DO_EMPLOYEES = [
  { department: "DO Gov Relation", position: "Government Relations officer", name: "Abbas Hussein Ahmad" },
  { department: "Human Resources", position: "HR Officer", name: "Abdalla Ahmed Jamal Amer Elmasri" },
  { department: "DO IT", position: "IT Support Specialist", name: "Abdul Careem Mohammed Aneeque" },
  { department: "Engineering", position: "Electrical Supervisor", name: "Abhijith Sasidhara Vasanthakumary" },
  { department: "DO IT", position: "IT Support Specialist", name: "Ahmad Mahmoud Harfoush" },
  { department: "DO Marketing", position: "Production Traffic & Design Support Specialist", name: "Ahmed Ben Mahmoud" },
  { department: "DO Purchasing", position: "Stock Keeper", name: "Akhil Prakash Irinavu" },
  { department: "Padel", position: "Padel Coach", name: "Alejandro Pellicer Lorenzo" },
  { department: "Engineering", position: "FM Engineer", name: "Allan Niebres Solomon" },
  { department: "DO Gov Relation", position: "Government Relations Coordinator", name: "Alnoman Mohamadahmed Ibrahim" },
  { department: "Padel", position: "Padel Coach", name: "Alvaro lorenzo" },
  { department: "DO IT", position: "System Administrator", name: "Amhar Mohamed Ameen" },
  { department: "Engineering", position: "Support Team", name: "Amos Nii Lante Lawson" },
  { department: "Engineering", position: "Support Team", name: "Amran Hossain Sumon" },
  { department: "Engineering", position: "Plumber", name: "Amran Miah Ratan Miah" },
  { department: "Corporate Office", position: "Executive Assistant", name: "Analisa Bernabe" },
  { department: "DO IT", position: "Audio Visual Support Technician", name: "Anil Nayak" },
  { department: "DO Purchasing", position: "Procurement Officer", name: "Arcel Lamparas Manuales" },
  { department: "Engineering", position: "Plumber", name: "Arneil Niturada Gancena" },
  { department: "Food and Beverage", position: "Barista", name: "Arun Selvarajan" },
  { department: "Engineering", position: "HVAC Technician", name: "Asgar Khan" },
  { department: "DO IT", position: "IT Support Specialist", name: "Asharudeen Poonthala Poonthala" },
  { department: "Engineering", position: "HVAC Technician", name: "Ashique Miyan" },
  { department: "DO Purchasing", position: "Head Storekeeper", name: "Ashraf Ali Mohamed Nawas" },
  { department: "Engineering", position: "HVAC Technician", name: "Asif Khan" },
  { department: "DO Marketing", position: "Sr. Creative Traffic & Translation Specialist", name: "Asil A. A. Ismail" },
  { department: "DO Purchasing", position: "Receiving Officer", name: "Ayaz Khan" },
  { department: "DO Marketing", position: "Senior Graphic Designer", name: "Azza Zouari" },
  { department: "Engineering", position: "Helper", name: "Bashar Kalam" },
  { department: "DO Marketing", position: "Culinary Portfolio Growth & Marketing Manager", name: "Bateena Alqubaj" },
  { department: "Engineering", position: "HVAC Technician", name: "Benito Loreto Pame" },
  { department: "Engineering", position: "Support Team", name: "Benyah Chinedu Amadi" },
  { department: "DO Purchasing", position: "Stock Keeper", name: "Bharath Raj Puthiya Purayil" },
  { department: "DO Purchasing", position: "Stock Keeper", name: "Bishnu Bahadur Pariyar" },
  { department: "Engineering", position: "Support Team", name: "Brayan Anyati" },
  { department: "Engineering", position: "Support Team", name: "Brian Aminga Mogotu" },
  { department: "Engineering", position: "Support Team", name: "Chidubem Justice Ukachu" },
  { department: "Legal, Compliance & Stakeholder Relations", position: "Compliance Officer", name: "Chiheb Zouinkhi" },
  { department: "DO Marketing", position: "Brand Marketing Manager", name: "Christina Georges Khaled" },
  { department: "DO Marketing", position: "Director of Marketing, Communications and Partnerships", name: "Dana El Namly" },
  { department: "Engineering", position: "Support Team", name: "Daniel Onuabuchi Agu" },
  { department: "DO Marketing", position: "Social Media Specialist", name: "dddd" },
  { department: "Engineering", position: "Support Team", name: "Derrick Ngunjiri Kinyua" },
  { department: "Engineering", position: "Plumber", name: "Didar Alam Abdulkhalek" },
  { department: "DO Purchasing", position: "Purchasing Clerk", name: "Dilan Chanaka Thebuwana Acharige" },
  { department: "Food and Beverage", position: "Acting - F & B Director", name: "Djodie Detry Sani" },
  { department: "DO Purchasing", position: "Purchasing Officer", name: "Dominador Jr. Rin" },
  { department: "Human Resources", position: "Talent Development Specialist", name: "Donavan Jose Cabantac" },
  { department: "Finance", position: "Quantity Surveyor", name: "Donna Marie Ubaldo" },
  { department: "Engineering", position: "Fit-out Technician", name: "Ejaz Ahmed" },
  { department: "Padel", position: "Padel Coordinator", name: "Elias Kadhikawa" },
  { department: "Food and Beverage", position: "Executive Chef Doha Oasis Group", name: "Emmanouil Adam" },
  { department: "Engineering", position: "Support Team", name: "Eshamuddin Khan" },
  { department: "DO IT", position: "UI/UX Designer", name: "Eufraim Lawrence Ponce" },
  { department: "Food and Beverage", position: "Quality and Food Safety Manager", name: "Evangeline Pearl Jayakumar" },
  { department: "DO Marketing", position: "Senior Graphic Designer", name: "Fadi Attar" },
  { department: "Engineering", position: "HVAC Technician", name: "Farhan Qamer Khan" },
  { department: "Padel", position: "Padel Coach", name: "Farinaz Mirjalili" },
  { department: "DO IT", position: "Senior ELV/ICT Engineer", name: "Fayas Karakkutti" },
  { department: "DO Purchasing", position: "Purchasing Officer", name: "Federico III Vaplor" },
  { department: "Engineering", position: "Support Team", name: "Ferdinand Owino Odour" },
  { department: "Corporate Office", position: "Driver", name: "Firoz Miya" },
  { department: "Legal, Compliance & Stakeholder Relations", position: "Legal and Compliance Coordinator", name: "Florenz Gaste" },
  { department: "Engineering", position: "MV Operation Engineer", name: "Hariharan Ramachandran Pillai" },
  { department: "Engineering", position: "Mechanical Engineer", name: "Haris Kutteeri" },
  { department: "Engineering", position: "Support Team", name: "Hope Afoma Woko" },
  { department: "Engineering", position: "Support Team", name: "Innocent Jacob Ukwatar" },
  { department: "DO Purchasing", position: "Procurement Officer", name: "Irfan Manshad" },
  { department: "Engineering", position: "Mechanical Engineer", name: "Irfan Mohammed Abdul" },
  { department: "DO Purchasing", position: "Team Leader", name: "Ivan Kibuye" },
  { department: "Engineering", position: "HVAC Technician", name: "Jahangir Khan Muslim Khan" },
  { department: "Food and Beverage", position: "F & B Admin Support", name: "Jan Rey Nicole Legaspi" },
  { department: "Human Resources", position: "Driver", name: "Jeevakanth Sinthilnathan" },
  { department: "Engineering", position: "Security Coordinator", name: "Jemily F. Gatuz" },
  { department: "Padel", position: "Padel Receptionist", name: "Joan Namugogo" },
  { department: "Engineering", position: "Admin Assistant", name: "Joanna Serentas Bisnar" },
  { department: "DO Purchasing", position: "Team Leader", name: "Joel Cells Basa" },
  { department: "Engineering", position: "Procurement Officer", name: "Joel Sony" },
  { department: "Engineering", position: "Support Team", name: "John Njiiri Mbugua" },
  { department: "DO IT", position: "Functional Consultant - Business Systems", name: "Jomar Peralta" },
  { department: "Engineering", position: "QAQC Engineer", name: "Jonathan Dennis" },
  { department: "Finance", position: "Director of Finance", name: "Kaja Mohideen" },
  { department: "Engineering", position: "Electrical Technician", name: "Kamaladasa Marie Ramachandran" },
  { department: "Human Resources", position: "Logistics Supervisor", name: "Kamel Razik" },
  { department: "Engineering", position: "Security Guard", name: "Kebba Jeng" },
  { department: "Engineering", position: "Support Team", name: "Kelechi Udochukwu Njoku" },
  { department: "Engineering", position: "Plumber", name: "Kelvin Boit Kimaru" },
  { department: "Engineering", position: "HVAC Technician", name: "Khursheed Alam Soman" },
  { department: "Human Resources", position: "HR Officer", name: "Kiddie Lucero" },
  { department: "Engineering", position: "Support team Supervisor", name: "Kingsley Ugboaja" },
  { department: "Human Resources", position: "HR Officer", name: "SHAHEELA" },
  { department: "Food and Beverage", position: "Hygiene Officer", name: "Lara Saade" },
  { department: "DO Purchasing", position: "Purchasing Officer", name: "Lorena Arias Garcia" },
  { department: "Engineering", position: "Fit-out Inspector", name: "Lorenzo Jr. Agravante" },
  { department: "Engineering", position: "Support Team", name: "Luqman Alfan Wengo" },
  { department: "DO Purchasing", position: "Stock Keeper", name: "Madhab Khadka" },
  { department: "Human Resources", position: "Driver", name: "Mahammad Junaid" },
  { department: "Padel", position: "Padel Coordinator", name: "Manar Ahmed Kassem" },
  { department: "DO Purchasing", position: "Group Head of Procurement", name: "Mangala Sudarman Jayawardane" },
  { department: "Food and Beverage", position: "Waitress", name: "Maricris Yyance" },
  { department: "Engineering", position: "Support Team", name: "Marshall Chimaobi Nwanganga" },
  { department: "Human Resources", position: "HR Operations Supervisor", name: "Mary Grace Llamas Pontevedra" },
  { department: "DO Purchasing", position: "Loading Bay Manager", name: "Matthew Kemekwu" },
  { department: "Engineering", position: "Electrical Technician", name: "MD Azhar Ali" },
  { department: "Engineering", position: "HVAC Technician", name: "MD Mozahid Shekh" },
  { department: "Engineering", position: "Fit-out Technician", name: "MD Nur Nobi" },
  { department: "DO Purchasing", position: "Driver", name: "MD Rajebul" },
  { department: "Engineering", position: "Maintenance Technician", name: "MD Rakib Hossan" },
  { department: "Engineering", position: "HVAC Technician", name: "MD Shahjahan" },
  { department: "DO Marketing", position: "Sr Brand Content Specialist", name: "Mehrez Meliani" },
  { department: "Engineering", position: "HVAC Technician", name: "Meraj Ahmed" },
  { department: "DO Purchasing", position: "Purchasing Manager", name: "Milroy Arnold Fernando" },
  { department: "DO Marketing", position: "Corporate Marketing & Partnership Manager", name: "Mohammad Abbas Doud Mohammad Salman" },
  { department: "Engineering", position: "HVAC Technician", name: "Mohammad Abdul Fareed Uddin Baba" },
  { department: "Engineering", position: "Helper", name: "Mohammad Abdur Rokib" },
  { department: "Engineering", position: "Electrician", name: "Mohammad Mojahid" },
  { department: "Engineering", position: "Senior Electrical Technician", name: "Mohammad Rizwan Ansari" },
  { department: "Corporate Office", position: "Shipping Agent", name: "Mohammed Ahmed Saied" },
  { department: "Engineering", position: "HVAC Technician", name: "Mohammed Mudassir Hamza" },
  { department: "Corporate Office", position: "Shipping Agent", name: "Mohammed Saleh Ibrahim" },
  { department: "Engineering", position: "Helper", name: "Mohan Rai" },
  { department: "DO Purchasing", position: "Cost Controller", name: "Mohomed Sabry Farook" },
  { department: "DO IT", position: "Application Lead", name: "Moiz Shaikh" },
  { department: "Engineering", position: "HVAC Technician", name: "Mostafa Bhuiyan" },
  { department: "Engineering", position: "Director of Engineering and Support Services", name: "Mouhamad Ammar Albshara" },
  { department: "DO Marketing", position: "Digital Marketing & CRM Manager", name: "Muhammad Nasir Mauroof" },
  { department: "DO IT", position: "Application Specialist", name: "Muhammad Usman Khan Ashiq Khan" },
  { department: "Finance", position: "Accountant", name: "Muhammad Zafar Mir Hussain Khan" },
  { department: "Engineering", position: "General Techicion Supervisor", name: "Muhammad Zubair Muhammad Islam" },
  { department: "DO Gov Relation", position: "Government Relations Officer", name: "Musab Elfadl" },
  { department: "DO Gov Relation", position: "Government Relations Officer", name: "Nabil Hezzi" },
  { department: "Engineering", position: "Electrical Technician", name: "Najiruddin Noor Hasan" },
  { department: "DO Marketing", position: "Digital & CRM Specialist", name: "Naseeha" },
  { department: "Engineering", position: "Logistics Officer", name: "Natthi Lal Jatav" },
  { department: "DO Marketing", position: "Videography Production Specialist", name: "Nelvin Paguia" },
  { department: "DO Purchasing", position: "Cost Controller", name: "Oscar Jr Targa" },
  { department: "Engineering", position: "Mechanical Engineer", name: "Oudai Abou Gouch" },
  { department: "DO Marketing", position: "Photography & Videography Production Specialist", name: "Paolo Mari Ferrer Mallari" },
  { department: "Engineering", position: "Electrician", name: "Paresh Chandra" },
  { department: "Engineering", position: "Support Team", name: "Peter Wanatoya Wandera" },
  { department: "DO IT", position: "Senior IT Support Technician", name: "Piratheepan Uruththiralingam" },
  { department: "DO Marketing", position: "Senior Motion & Graphic Designer", name: "potential ali or chehab" },
  { department: "DO Marketing", position: "SR Multimedia Digital Graphic Designer", name: "potential rosalie" },
  { department: "Engineering", position: "Fit-out Technician", name: "Pramod Sharma" },
  { department: "DO Purchasing", position: "Receiving Officer", name: "Prasanth Sasi" },
  { department: "DO Purchasing", position: "Stock Keeper", name: "Prashuram Tharu" },
  { department: "DO Purchasing", position: "Storekeeper", name: "Prem Lal Tamang" },
  { department: "Engineering", position: "Plumber", name: "Premnath Wellington" },
  { department: "Engineering", position: "Support Team", name: "Princewill Irechukwu Nnodim" },
  { department: "Engineering", position: "Logistic Coordinator", name: "Radouane Manser" },
  { department: "Finance", position: "Finance Assistant", name: "Radwa Khaled Ahmed Sewify" },
  { department: "DO Purchasing", position: "Purchasing Supervisor", name: "Raissa Rafael" },
  { department: "DO IT", position: "IT Support Technician", name: "Rakesh Kumar Das" },
  { department: "Engineering", position: "Fit-out Technician", name: "Ram Chandra Badhai" },
  { department: "Engineering", position: "Senior Fitout Technician", name: "Ram Jan Ali" },
  { department: "Engineering", position: "Helper", name: "Ram Udagar Sahani" },
  { department: "DO IT", position: "UI/UX Designer", name: "Raphael Yabut" },
  { department: "DO IT", position: "IT Support Engineer", name: "Razan Alaa" },
  { department: "DO IT", position: "Compliance Lead -Technology", name: "Rejin Chulliparambil Ramanan" },
  { department: "DO Marketing", position: "Team Leader Graphic Designer", name: "Richard James Sayson" },
  { department: "DO Purchasing", position: "Stock Keeper", name: "Richter Gozon Serrano" },
  { department: "DO IT", position: "Director of Technology", name: "Rinesh Nanu" },
  { department: "Engineering", position: "Helper", name: "Risha Noufil Thondiparambil" },
  { department: "Finance", position: "Cashier", name: "Rita Nyambura Njururi" },
  { department: "Engineering", position: "Plumber", name: "Rizwan Kalanther Leb Be" },
  { department: "Engineering", position: "Electrical technician", name: "Rohan John Vas Francis" },
  { department: "Human Resources", position: "Driver", name: "Rohith Shetty" },
  { department: "DO IT", position: "Head - Business Solutions & Projects", name: "Ronaldo Parlan" },
  { department: "Engineering", position: "Support Team", name: "Roy Kelvin Chomba Muriuki" },
  { department: "Engineering", position: "Plumber", name: "Ruhul Amin Bablu" },
  { department: "Engineering", position: "Electrician", name: "Sajan Thankachan" },
  { department: "Engineering", position: "Maintenance Technician", name: "Salman Sulaiman Sulaiman" },
  { department: "DO Purchasing", position: "Receiving Supervisor", name: "Saman Samarakoon" },
  { department: "Engineering", position: "Support Team", name: "Samuel Adolf Muiruri Kamau" },
  { department: "Engineering", position: "Support Team", name: "Samuel Gift James" },
  { department: "Food and Beverage", position: "F & B Sales Executive", name: "Sara Shaban" },
  { department: "Human Resources", position: "Director of Human Resources", name: "Sarab Zourob" },
  { department: "DO Purchasing", position: "Cost Controller", name: "Senjid Muhammed" },
  { department: "Human Resources", position: "Driver", name: "Shahid Mahmud" },
  { department: "DO Purchasing", position: "Stock Keeper", name: "Shahul Hameed" },
  { department: "Engineering", position: "HVAC Technician", name: "Sharafat Husain" },
  { department: "Engineering", position: "Maintenance Technician", name: "Sheik Hussain (resigned )" },
  { department: "Corporate Office", position: "Office Boy", name: "Shrinivas Gudla" },
  { department: "DO Purchasing", position: "Storekeeper", name: "Shuuveni Panduleni Ndeyapanda Imbondi" },
  { department: "DO Purchasing", position: "Storekeeper", name: "Simoj Mohanan Seetha" },
  { department: "Engineering", position: "Support Team", name: "Simon Alituha" },
  { department: "Engineering", position: "Sr. HSE Officer", name: "Soli Keerampilly Joseph" },
  { department: "Food and Beverage", position: "Hygiene Supervisor", name: "Soufeek Ahmath Ahamathu Vazeer" },
  { department: "DO Purchasing", position: "Store Assistant / Helper", name: "Subakar Karunakaran" },
  { department: "Human Resources", position: "Driver", name: "Sudheesh Gopi" },
  { department: "Engineering", position: "HVAC Technician", name: "Sulaiman Ahmed Kunhi" },
  { department: "Engineering", position: "Support Team", name: "Syed Asad Raza Shah" },
  { department: "Finance", position: "Financial Accounting Supervisor", name: "Thubindra Sangraram" },
  { department: "Engineering", position: "Support Team", name: "Uchenna Henry Maneme" },
  { department: "Engineering", position: "Support Team", name: "Ugochukwu Princewill Aniekwu" },
  { department: "Engineering", position: "Electrical Technician", name: "Umesh Rajan Uthamarajan Gopalan" },
  { department: "DO Purchasing", position: "Stock Keeper", name: "Upendra Nadha" },
  { department: "Engineering", position: "Maintenance Technician", name: "Valerian Dsouza" },
  { department: "Engineering", position: "Electrician", name: "Vetriselvan Thiruselvan" },
  { department: "Engineering", position: "Support Team", name: "Victor Udochukwu Orji" },
  { department: "DO Purchasing", position: "Purchasing Officer", name: "Vishnu Mohandas" },
  { department: "Legal, Compliance & Stakeholder Relations", position: "Director of Legal Compliance and Stakeholder Relation", name: "Wassim Darwish" },
  { department: "DO Marketing", position: "Social Media Specialist", name: "Waverly Teresa Dias" },
  { department: "Food and Beverage", position: "Artistic Manager", name: "Wilda Ferrer" },
  { department: "DO Purchasing", position: "Head Storekeeper", name: "Yannick Leroy Rinzley Fernando" },
  { department: "Padel", position: "Padel Coordinator (Freelance)", name: "Yasser ALMohamad" },
  { department: "DO IT", position: "Asst. Director of Technology", name: "Youssef Ftouni" },
  { department: "DO Gov Relation", position: "Government Relations Officer", name: "Zeina Nassar" }
];

const KIEN_EMPLOYEES = [
  { name: "LAMEES ILIAS", position: "HR Specialist", department: "Human Resources" },
  { name: "MUBARAK AZIZ", position: "Finance Manager", department: "Finance" },
  { name: "MOHAMMED SHUAIBUR ISLAM", position: "Supervisor - Reliver", department: "House Keeping" },
  { name: "MASUM MOKHLESUR RAHMAN", position: "Driver", department: "Operations" },
  { name: "MD MASUKUR RAHMAN", position: "Male Cleaner", department: "House Keeping" },
  { name: "MD SALMAN", position: "Driver", department: "House Keeping" },
  { name: "GOPAL BAHADUR DARJI", position: "Male Cleaner", department: "House Keeping" },
  { name: "BHIM BAHADUR BALAMPAKI", position: "Male Cleaner", department: "House Keeping" },
  { name: "MOHAMMED ABDUL MANNAN", position: "Operation Manager", department: "Operations" },
  { name: "SHYAM KUMAR YADAV", position: "Plumber cum Electrician", department: "Maintenance" },
  { name: "BISUN DEV KAMAIT", position: "Male Cleaner", department: "House Keeping" },
  { name: "JUBER ALAM", position: "Male Cleaner", department: "House Keeping" },
  { name: "JIBRAIL MIYA", position: "Supervisor", department: "House Keeping" },
  { name: "BHUMRAJ RAI", position: "Male Cleaner", department: "House Keeping" },
  { name: "NAZMUL HASAN MOEJ UDDIN", position: "Male Cleaner", department: "House Keeping" },
  { name: "MD FARUK MIA", position: "Steward", department: "House Keeping" },
  { name: "MD RONI MIAH", position: "Male Cleaner", department: "House Keeping" },
  { name: "AZIZ SAHED ALI", position: "Male Cleaner", department: "House Keeping" },
  { name: "HAJRAT BEILLAL MAHAS MIAH", position: "Male Cleaner", department: "House Keeping" },
  { name: "MOHAMMAD ZAHER HOSSEN", position: "Male Cleaner", department: "House Keeping" },
  { name: "MD SHAHADAT HOSSAIN", position: "Steward", department: "House Keeping" },
  { name: "RAHAMATH ULLAH ALI AKBOR", position: "Male Cleaner", department: "Maintenance" },
  { name: "NUR NABY PRAMANIK", position: "Male Cleaner", department: "House Keeping" },
  { name: "GOVIND RAY", position: "Male Cleaner", department: "House Keeping" },
  { name: "HARMESH SINGH RATAN SINGH", position: "Driver", department: "Operations" },
  { name: "RONY MIAH AKASH", position: "Male Cleaner", department: "House Keeping" },
  { name: "MAMUN AHMAD ABDUL SOBUR", position: "Male Cleaner", department: "House Keeping" },
  { name: "NUR ALAM KHOKAN MIAH", position: "Male Cleaner", department: "House Keeping" },
  { name: "DHANBIR SAH", position: "Male Cleaner", department: "House Keeping" },
  { name: "SHYAM SUNDAR MANDAL KHATBE", position: "Male Cleaner", department: "House Keeping" },
  { name: "MD MUKTAR HOSSAIN", position: "Male Cleaner", department: "House Keeping" },
  { name: "OPENDRA SAH TELI", position: "Male Cleaner", department: "House Keeping" },
  { name: "MASUD MIAH JOYN UDDIN AHAMED", position: "Male Cleaner", department: "House Keeping" },
  { name: "SANGITA SEWA", position: "Female Cleaner", department: "House Keeping" },
  { name: "SHOVA SINGH SUNAR", position: "Female Cleaner", department: "House Keeping" },
  { name: "NIRMALA LIMBU", position: "Female Cleaner", department: "House Keeping" },
  { name: "SUKHAMAYA LIMBU", position: "Female Cleaner", department: "House Keeping" },
  { name: "MUHAMMAD ZUBAIR AKRAM", position: "Supervisor", department: "House Keeping" },
  { name: "KARNAKAR GADAM", position: "Supervisor", department: "House Keeping" },
  { name: "MOBARAK HOSSAIN", position: "Foreman", department: "House Keeping" },
  { name: "RAJIN SALEH AHMED RASEL", position: "Project Coordinator", department: "Operations" },
  { name: "MD SELIM REZA", position: "Male Cleaner", department: "House Keeping" },
  { name: "MAMUN DALI", position: "Male Cleaner", department: "House Keeping" },
  { name: "MD TOFIKUR RAHMAN", position: "Male Cleaner", department: "House Keeping" },
  { name: "GANESH BAHADUR KARKI", position: "Male Cleaner", department: "House Keeping" },
  { name: "MERCY EVANGELISTA LAURENO", position: "Accounting Officer", department: "Finance" },
  { name: "MD SALIM ANOWAR HOSSAIN", position: "Male Cleaner", department: "House Keeping" },
  { name: "SANJAY PAL", position: "Male Cleaner", department: "House Keeping" },
  { name: "PARAMJIT SINGH", position: "Male Cleaner", department: "House Keeping" },
  { name: "AMIT RAJENDRA PRASAD", position: "Male Cleaner", department: "House Keeping" },
  { name: "LALIT KUMAR YADAV", position: "Male Cleaner", department: "House Keeping" },
  { name: "RAJESH RAI", position: "Steward", department: "House Keeping" },
  { name: "RAMESH KARKI", position: "Steward", department: "House Keeping" },
  { name: "SURESH NEPALI", position: "Steward", department: "House Keeping" },
  { name: "DEBRAJ PARIYAR", position: "Male Cleaner", department: "House Keeping" },
  { name: "DIPENDRA KUMAR YADAV", position: "Steward", department: "House Keeping" },
  { name: "MANJUR RAIN", position: "Male Cleaner", department: "House Keeping" },
  { name: "SANTOSH KARKI", position: "Male Cleaner", department: "House Keeping" },
  { name: "TANKA BAHADUR KARKI", position: "Male Cleaner", department: "House Keeping" },
  { name: "TIRTHA BAHADUR KARKI", position: "Male Cleaner", department: "House Keeping" },
  { name: "SURESH DHIMAL", position: "Male Cleaner", department: "House Keeping" },
  { name: "PRITHWI BAHADUR BK", position: "Steward", department: "House Keeping" },
  { name: "SAROJ BK", position: "Male Cleaner", department: "House Keeping" },
  { name: "SHAMAS MEHMOOD MEHMOOD NASIR", position: "Supervisor", department: "House Keeping" },
  { name: "SURAJ CHAUDHARY", position: "Male Cleaner", department: "House Keeping" },
  { name: "MUHAMMAD FAROOQ", position: "Male Cleaner", department: "House Keeping" },
  { name: "SALAUDDIN NEK MOHAMMAD", position: "Office Boy", department: "Maintenance" },
  { name: "UDITHA SAMPATH WEERASINGHA ARACHCHIGE", position: "Male Cleaner", department: "House Keeping" },
  { name: "THIRUSELVAM PERIYASAMY SANDANAM", position: "Male Cleaner", department: "House Keeping" },
  { name: "SAMPATH PRABODHANA WIJERA THNALAGE", position: "Male Cleaner", department: "House Keeping" },
  { name: "MOHAMMAD TANZIR ALAM", position: "Male Cleaner", department: "House Keeping" },
  { name: "MUHAMMAD QASIM HAMEED", position: "Male Cleaner", department: "House Keeping" },
  { name: "NOMAN HASSAN", position: "Male Cleaner", department: "House Keeping" },
  { name: "ATIF ALI", position: "Male Cleaner", department: "House Keeping" },
  { name: "UMAIR SHAHZAD", position: "Male Cleaner", department: "House Keeping" },
  { name: "KASHIF KHAN", position: "Male Cleaner", department: "House Keeping" },
  { name: "ASIM ALMAS ABBASI", position: "Driver", department: "Operations" },
  { name: "FAISAL HUSSAIN", position: "Male Cleaner", department: "Maintenance" },
  { name: "ANJU PARIYAR", position: "Female Cleaner", department: "House Keeping" },
  { name: "HUM NATH ARYAL", position: "Male Cleaner", department: "House Keeping" },
  { name: "CHABI LAL TAMANG", position: "Steward", department: "House Keeping" },
  { name: "MAHESHWOR POUDEL", position: "Male Cleaner", department: "House Keeping" },
  { name: "ROHIT RAM RAMDAS RAM", position: "Male Cleaner", department: "House Keeping" },
  { name: "RAJESH KUMAR YADAV", position: "Male Cleaner", department: "House Keeping" },
  { name: "DIPAK TAMANG", position: "Male Cleaner", department: "House Keeping" },
  { name: "RAHUL PREM MASIH", position: "Male Cleaner", department: "House Keeping" },
  { name: "KRISHNA HAMAL", position: "Male Cleaner", department: "House Keeping" },
  { name: "NILAKSHAN NARAYANAPILLAI VASANTHAKUMAR", position: "Male Cleaner", department: "House Keeping" },
  { name: "JAVED IQBAL", position: "Male Cleaner", department: "House Keeping" },
  { name: "RAM KUMAR KAMATI", position: "Male Cleaner", department: "House Keeping" },
  { name: "RAJESH KUMAR CHAUDHARY", position: "Male Cleaner", department: "House Keeping" },
  { name: "PURAN KHAWAS", position: "Male Cleaner", department: "House Keeping" },
  { name: "BHIM BAHADUR THAMI", position: "Male Cleaner", department: "House Keeping" },
  { name: "LUV KUMAR CHAMAR", position: "Male Cleaner", department: "House Keeping" },
  { name: "DIPU KUMAR MANDAL", position: "Steward", department: "House Keeping" },
  { name: "ALTAB HUSEN MANSUR", position: "Male Cleaner", department: "House Keeping" },
  { name: "MUHAMMAD JAWAD", position: "Male Cleaner", department: "House Keeping" },
  { name: "RAJU KUMAR SAH", position: "Male Cleaner", department: "House Keeping" },
  { name: "RAM BABU SAH", position: "Male Cleaner", department: "House Keeping" },
  { name: "JITENDRA DAS", position: "Male Cleaner", department: "House Keeping" },
  { name: "AFAQ MASOOD", position: "Supervisor", department: "House Keeping" },
  { name: "BASEER AHMED SYED", position: "Supervisor", department: "House Keeping" },
  { name: "ANJALI CHEPANG", position: "Female Cleaner", department: "House Keeping" },
  { name: "SAJJA RAI", position: "Female Cleaner", department: "House Keeping" },
  { name: "DEBIKA RAI", position: "Female Cleaner", department: "House Keeping" },
  { name: "ARMAN ALI", position: "Male Cleaner", department: "House Keeping" },
  { name: "PRADIP BISHWAKARMA", position: "Male Cleaner", department: "House Keeping" },
  { name: "PASHUPATI YADAV", position: "Male Cleaner", department: "House Keeping" },
  { name: "MOHAMMAD AFTAB ALAM", position: "Male Cleaner", department: "House Keeping" },
  { name: "ARIEL CENTENO TAHIMIC", position: "Supervisor", department: "House Keeping" },
  { name: "DILAKSHAN SUNTHARALINGAM", position: "Male Cleaner", department: "House Keeping" },
  { name: "GOMA SARKI", position: "Female Cleaner", department: "House Keeping" },
  { name: "ROHIT MAHAT", position: "Male Cleaner", department: "House Keeping" },
  { name: "TALU MURMU", position: "Female Cleaner", department: "House Keeping" },
  { name: "AJAY YADAV", position: "Male Cleaner", department: "House Keeping" },
  { name: "DINESH KUMAR ARAVINDA", position: "Male Cleaner", department: "House Keeping" },
  { name: "ABDUL RAFEY", position: "Male Cleaner", department: "House Keeping" },
  { name: "RASHAD MEHMOOD", position: "Driver", department: "Operations" },
  { name: "ROSHAN VAIRAMUTHTHU", position: "Steward", department: "House Keeping" },
  { name: "JATHUSANAN KANTHIAH THIRUNAVUKKARUSU", position: "Male Cleaner", department: "House Keeping" },
  { name: "DANISHAN THANGAVEL", position: "Male Cleaner", department: "House Keeping" },
  { name: "KANTHAIYAH PONNAMPALAM DINESH", position: "Male Cleaner", department: "House Keeping" },
  { name: "KIMARUTHAN SIVANATHAN", position: "Male Cleaner", department: "House Keeping" },
  { name: "JASHOK KUMAR KANAKENTHIRAN", position: "Steward", department: "House Keeping" },
  { name: "UMESH RAY", position: "Male Cleaner", department: "House Keeping" },
  { name: "RAM SHANKAR MUKHIYA", position: "Male Cleaner", department: "House Keeping" },
  { name: "DOBENDRA KUMAR THAKUR", position: "Steward", department: "House Keeping" },
  { name: "AANAND MANDAL", position: "Male Cleaner", department: "House Keeping" },
  { name: "SHIV NARAYAN THAKUR", position: "Male Cleaner", department: "House Keeping" },
  { name: "MD PARWEZ ALAM", position: "Male Cleaner", department: "House Keeping" },
  { name: "TANK PRASAD BK", position: "Male Cleaner", department: "House Keeping" },
  { name: "SAIKUMAR KARKA", position: "Male Cleaner", department: "House Keeping" },
  { name: "MD ISA MIYA", position: "Male Cleaner", department: "House Keeping" },
  { name: "SAROJ KUMAR SADA", position: "Male Cleaner", department: "House Keeping" },
  { name: "AJAY KUMAR MANDAL", position: "Male Cleaner", department: "House Keeping" },
  { name: "SUBA SINGH HEERA SINGH", position: "Male Cleaner", department: "House Keeping" },
  { name: "RITA BISHWAKARMA", position: "Female Cleaner", department: "House Keeping" },
  { name: "SAHAB UDDIN", position: "Supervisor", department: "House Keeping" },
  { name: "TUHIN HOSSAIN OLEEN", position: "Supervisor", department: "House Keeping" },
  { name: "SANO KANCHI DANUWAR", position: "Female Cleaner", department: "House Keeping" },
  { name: "SUNITA THOKAR", position: "Female Cleaner", department: "House Keeping" },
  { name: "PADAM KUMARI TIRUWA", position: "Female Cleaner", department: "House Keeping" },
  { name: "MANJU RAI", position: "Female Cleaner", department: "House Keeping" },
  { name: "MOHAMMAD RASEL HOSSEN", position: "Maintenance Team Leader", department: "Operations" },
  { name: "PIRANJUJAN KIRAKAPIRAPA", position: "Housekeeping attendant", department: "House Keeping" },
  { name: "SAMEER SALEEM", position: "Male Cleaner", department: "House Keeping" },
  { name: "SUKEERTHAN KUKATHASAN", position: "Male Cleaner", department: "House Keeping" },
  { name: "VISIYAKUMAR VINAYAGAMOORTHY", position: "Male Cleaner", department: "House Keeping" },
  { name: "RAJENDHAR PENDYALA", position: "Male Cleaner", department: "House Keeping" },
  { name: "PAVAN KOTHURI", position: "Male Cleaner", department: "House Keeping" },
  { name: "DEVI KHANAL", position: "Female Cleaner", department: "House Keeping" },
  { name: "CHANDARA KALA BHANDARI ADHIKARI", position: "Female Cleaner", department: "House Keeping" },
  { name: "ANJALI TAMANG", position: "Female Cleaner", department: "House Keeping" },
  { name: "RAJESH KANDI", position: "Male Cleaner", department: "House Keeping" },
  { name: "NARESH KUMAR JAKKULA", position: "Male Cleaner", department: "House Keeping" },
  { name: "LAXMAN GAJJELA", position: "Male Cleaner", department: "House Keeping" },
  { name: "HASSAN MUSTAFA", position: "Supervisor", department: "House Keeping" },
  { name: "PABITRA BK", position: "Female Cleaner", department: "House Keeping" },
  { name: "AMIR MANSURI", position: "Male Cleaner", department: "House Keeping" },
  { name: "BIKI SAHU", position: "Male Cleaner", department: "House Keeping" },
  { name: "GUDDU LONIYA", position: "Male Cleaner", department: "House Keeping" },
  { name: "MUHAMMAD FAWAD SHEHAN SHAH", position: "Male Cleaner", department: "House Keeping" },
  { name: "BIJAN GURUNG", position: "Male Cleaner", department: "House Keeping" },
  { name: "YAM BAHADUR GAIHRE", position: "Male Cleaner", department: "House Keeping" },
  { name: "SURAJ THARU", position: "Male Cleaner", department: "House Keeping" },
  { name: "YAM BAHADUR PARIYAR", position: "Male Cleaner", department: "House Keeping" },
  { name: "SUK BAHADUR SUNAR", position: "Male Cleaner", department: "House Keeping" },
  { name: "GULAM RABBANI", position: "Supervisor", department: "House Keeping" },
  { name: "MASARUL ALAM MD ISMAIL", position: "Male Cleaner", department: "House Keeping" },
  { name: "ALINA GHALAN", position: "Female Cleaner", department: "House Keeping" },
  { name: "JOHN TWESIGYE", position: "Male Cleaner", department: "House Keeping" },
  { name: "MD NAIM UDDIN", position: "Supervisor", department: "House Keeping" },
  { name: "DAVIS TWEAIGYE", position: "Steward", department: "House Keeping" },
  { name: "MUHAMMED WAQAS MUHAMMAD SARWAR", position: "Male Cleaner", department: "House Keeping" },
  { name: "SANSARI RAI LIMBU", position: "Female Cleaner", department: "House Keeping" },
  { name: "ANAMUL HAQUE", position: "Male Cleaner", department: "House Keeping" },
  { name: "ARAFAT HOSSEN AYUB NOBI", position: "Supervisor", department: "House Keeping" },
  { name: "SOBUZ MIAH ALI AHMED", position: "Steward", department: "House Keeping" },
  { name: "MONIR HOSSAN MD SHAFIQUL ISLAM", position: "Steward", department: "House Keeping" },
  { name: "TILOCHAN BHURTEL", position: "Male Cleaner", department: "House Keeping" },
  { name: "ASHIK SRYAL", position: "Male Cleaner", department: "House Keeping" },
  { name: "RAM BAHADUR KHADKA", position: "Male Cleaner", department: "House Keeping" },
  { name: "NAJMUL HASAN SAMI", position: "Steward", department: "House Keeping" },
  { name: "UTTAM KARKI", position: "Steward", department: "House Keeping" },
  { name: "K M HABIBUL ISLAM SUJAN", position: "Male Cleaner", department: "House Keeping" },
  { name: "JUNA NEPALI", position: "Female Cleaner", department: "House Keeping" },
  { name: "MD ELIAS MD ABDUS SAMAD", position: "Male Cleaner", department: "House Keeping" },
  { name: "MD ABU ZAHER", position: "Supervisor", department: "House Keeping" },
  { name: "MD MAHFUJ HOSSEN MD MIZI", position: "Steward", department: "House Keeping" },
  { name: "DIPAK KUMAR MAHATO", position: "Male Cleaner", department: "House Keeping" },
  { name: "LOCHAN DAHAL", position: "Male Cleaner", department: "House Keeping" },
  { name: "BIVEK KARKI", position: "Male Cleaner", department: "House Keeping" },
  { name: "NARAYAN PRASAD", position: "Male Cleaner", department: "House Keeping" },
  { name: "IKRAM NAZIR", position: "Male Cleaner", department: "House Keeping" },
  { name: "MUHAMMED AAMIR ZAIB", position: "Male Cleaner", department: "House Keeping" },
  { name: "UMER RIAZ", position: "Housekeeping attendant", department: "House Keeping" },
  { name: "GULFAN ANSARI", position: "Male Cleaner", department: "House Keeping" },
  { name: "SUMAN TOLAD HOSSAIN", position: "Male Cleaner", department: "House Keeping" },
  { name: "MOHAMMAD HASAN MOHAMMAD HAFAZ", position: "Male Cleaner", department: "House Keeping" },
  { name: "ROHIT CHAUDHARY", position: "Male Cleaner", department: "House Keeping" },
  { name: "HARIGUL ISLAM", position: "Steward", department: "House Keeping" },
  { name: "MANOJ KUMAR RAYA", position: "Male Cleaner", department: "House Keeping" },
  { name: "MUHAMMAD HUSSAIN", position: "Male Cleaner", department: "House Keeping" },
  { name: "SUJAN LIMBU", position: "Male Cleaner", department: "House Keeping" },
  { name: "MOHAMMAD SHAHJAD MOHAMMAD RAHMAN", position: "Male Cleaner", department: "House Keeping" },
  { name: "CHANDAN KUMAR YADAV", position: "Male Cleaner", department: "House Keeping" },
  { name: "SANTHOSH PARIYAR", position: "Male Cleaner", department: "House Keeping" },
  { name: "RAHUL SINGH MOHAN SINGH", position: "Male Cleaner", department: "House Keeping" },
  { name: "SHIV SHANKAR YADAV", position: "Male Cleaner", department: "House Keeping" },
  { name: "BASIT ABBASI GHULAM MUSTAFA", position: "Male Cleaner", department: "House Keeping" },
  { name: "AZHARUL ISLAM SOCIB", position: "Male Cleaner", department: "House Keeping" },
  { name: "MD NADIM SARDER", position: "Male Cleaner", department: "House Keeping" },
  { name: "IMRAN KHAN HUSSAIN BAKHT", position: "Male Cleaner", department: "House Keeping" },
  { name: "MIAN USMAN ALI MUHAMMAD AKRAM", position: "Male Cleaner", department: "House Keeping" },
  { name: "MANJU BISHWAKARMA", position: "Female Cleaner", department: "House Keeping" },
  { name: "MD ABDUR RAHIM MAJUMDER", position: "Steward", department: "House Keeping" },
  { name: "MAYLENE DALACAN SANCHEZ", position: "Steward", department: "House Keeping" },
  { name: "NATIVIDAD ORABILES EBIAS", position: "Steward", department: "House Keeping" },
  { name: "TUFAEL AHMED ABDUL BASIT", position: "Male Cleaner", department: "House Keeping" },
  { name: "SHIVA BAHADUR KUNWAR", position: "Steward", department: "House Keeping" },
  { name: "IBRAHIM KHALIL MD ABDUL MOTIN", position: "Steward", department: "House Keeping" },
  { name: "MAHABUL ISLAM", position: "Steward", department: "House Keeping" },
  { name: "FIRDOSH MIYA", position: "Driver", department: "Housekeeping" },
  { name: "BASHIR AHMED", position: "Male Cleaner", department: "House Keeping" },
  { name: "TURFAN BABU SHEKH", position: "Male Cleaner", department: "House Keeping" },
  { name: "ZEESHAN ALI", position: "Male Cleaner", department: "House Keeping" },
  { name: "SAIMON ISLAM", position: "Steward", department: "House Keeping" },
  { name: "HERO BARUA", position: "Steward", department: "House Keeping" },
  { name: "SAHABUDDIN BABUL MIAH", position: "Male Cleaner", department: "House Keeping" },
  { name: "SURHID BARUA SHUVO", position: "Male Cleaner", department: "House Keeping" },
  { name: "PURAN RAI", position: "Male Cleaner", department: "House Keeping" },
  { name: "RAHMAT MD", position: "Male Cleaner", department: "House Keeping" },
  { name: "PRAKASH SINGH DHAMI", position: "Male Cleaner", department: "House Keeping" },
  { name: "SUBROTO BHOUMIK NARAYAN SARKER", position: "Male Cleaner", department: "House Keeping" },
  { name: "DIPESH KUMAR SINGH KUSHAWAHA", position: "Male Cleaner", department: "House Keeping" }
];

// Seed Data
const seedData = () => {
  if (!localStorage.getItem(KEYS.POSITIONS)) {
    const positions: Position[] = [];
    localStorage.setItem(KEYS.POSITIONS, JSON.stringify(positions));
  }
  
  if (!localStorage.getItem(KEYS.EMPLOYEES)) {
    const employees: Employee[] = [];
    let idCounter = 1;

    // Seed Doha Oasis Employees
    DO_EMPLOYEES.forEach(data => {
        employees.push({
            id: idCounter++,
            name: data.name,
            operator: 'Doha Oasis',
            department: data.department || 'Operations',
            position: data.position || 'Team Member',
            grade: 'S1',
            date_joined: '2023-01-01'
        });
    });

    // Seed Kien Employees
    KIEN_EMPLOYEES.forEach(data => {
        employees.push({
            id: idCounter++,
            name: data.name,
            operator: 'Kien',
            department: data.department || 'Operations',
            position: data.position || 'Staff',
            grade: 'K1',
            date_joined: '2023-01-01'
        });
    });
    
    localStorage.setItem(KEYS.EMPLOYEES, JSON.stringify(employees));
  }
  
  if (!localStorage.getItem(KEYS.TASKS)) {
    const tasks: OnboardingTask[] = [];
    localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
  }

  if (!localStorage.getItem(KEYS.SEPARATIONS)) {
    const separations: SeparationRecord[] = [];
    localStorage.setItem(KEYS.SEPARATIONS, JSON.stringify(separations));
  }

  if (!localStorage.getItem(KEYS.ONBOARDINGS)) {
    const onboardings: OnboardingRecord[] = [];
    localStorage.setItem(KEYS.ONBOARDINGS, JSON.stringify(onboardings));
  }

  if (!localStorage.getItem(KEYS.PERFORMANCE)) {
    const performance: PerformanceRecord[] = [];
    localStorage.setItem(KEYS.PERFORMANCE, JSON.stringify(performance));
  }
};

seedData();

// Generic Helper
const getItems = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const saveItems = <T>(key: string, items: T[]) => {
  localStorage.setItem(key, JSON.stringify(items));
};

// Positions
export const getPositions = (): Position[] => getItems<Position>(KEYS.POSITIONS);

export const addPosition = (pos: Omit<Position, 'id'>) => {
  const items = getPositions();
  const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
  const newItem = { ...pos, id: newId };
  saveItems(KEYS.POSITIONS, [...items, newItem]);
  return newItem;
};

export const updatePosition = (pos: Position) => {
  const items = getPositions();
  const index = items.findIndex(p => p.id === pos.id);
  if (index !== -1) {
    items[index] = pos;
    saveItems(KEYS.POSITIONS, items);
  }
};

// Employees
export const getEmployees = (): Employee[] => getItems<Employee>(KEYS.EMPLOYEES);

// Helper to get only HR Team members (excluding Drivers)
export const getHRTeam = (): Employee[] => {
  return getEmployees().filter(e => e.department === 'Human Resources' && e.position !== 'Driver');
};

export const getEmployeeById = (id: number): Employee | undefined => getEmployees().find(e => e.id === id);
export const addEmployee = (emp: Omit<Employee, 'id'>) => {
  const items = getEmployees();
  const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
  const newItem = { ...emp, id: newId };
  saveItems(KEYS.EMPLOYEES, [...items, newItem]);
  return newItem;
};

// Tasks
export const getTasksByEmployee = (empId: number, category: 'Onboarding' | 'Separation' | 'Performance' = 'Onboarding'): OnboardingTask[] => {
  const tasks = getItems<OnboardingTask>(KEYS.TASKS).filter(t => t.employee_id === empId);
  return tasks.filter(t => (t.category || 'Onboarding') === category);
};

export const getAllTasks = (): OnboardingTask[] => getItems<OnboardingTask>(KEYS.TASKS);

export const getAllSeparationTasks = (): OnboardingTask[] => {
    return getAllTasks().filter(t => t.category === 'Separation');
};

export const addTask = (task: Omit<OnboardingTask, 'id'>) => {
  const items = getItems<OnboardingTask>(KEYS.TASKS);
  const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
  const newItem = { ...task, id: newId };
  saveItems(KEYS.TASKS, [...items, newItem]);
  return newItem;
};

export const updateTask = (task: OnboardingTask) => {
    const items = getAllTasks();
    const index = items.findIndex(t => t.id === task.id);
    if(index !== -1) {
        items[index] = task;
        saveItems(KEYS.TASKS, items);
    }
}

// Separations
export const getAllSeparations = (): SeparationRecord[] => getItems<SeparationRecord>(KEYS.SEPARATIONS);

export const getSeparationByEmployee = (empId: number): SeparationRecord | undefined =>
  getAllSeparations().find(s => s.employee_id === empId);

export const addSeparation = (sep: Omit<SeparationRecord, 'id'>) => {
  const items = getAllSeparations();
  const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
  const newItem = { ...sep, id: newId };
  saveItems(KEYS.SEPARATIONS, [...items, newItem]);
  return newItem;
};

export const updateSeparation = (sep: SeparationRecord) => {
  const items = getAllSeparations();
  const index = items.findIndex(s => s.id === sep.id);
  if (index !== -1) {
    items[index] = sep;
    saveItems(KEYS.SEPARATIONS, items);
  }
};

// Onboardings
export const getAllOnboardings = (): OnboardingRecord[] => getItems<OnboardingRecord>(KEYS.ONBOARDINGS);

export const getOnboardingByEmployee = (empId: number): OnboardingRecord | undefined =>
  getAllOnboardings().find(o => o.employee_id === empId);

export const addOnboarding = (rec: Omit<OnboardingRecord, 'id'>) => {
  const items = getAllOnboardings();
  const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
  const newItem = { ...rec, id: newId };
  saveItems(KEYS.ONBOARDINGS, [...items, newItem]);
  return newItem;
};

export const updateOnboarding = (rec: OnboardingRecord) => {
  const items = getAllOnboardings();
  const index = items.findIndex(r => r.id === rec.id);
  if (index !== -1) {
    items[index] = rec;
    saveItems(KEYS.ONBOARDINGS, items);
  }
};

// Performance
export const getAllPerformance = (): PerformanceRecord[] => getItems<PerformanceRecord>(KEYS.PERFORMANCE);

export const addPerformance = (rec: Omit<PerformanceRecord, 'id'>) => {
  const items = getAllPerformance();
  const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
  const newItem = { ...rec, id: newId };
  saveItems(KEYS.PERFORMANCE, [...items, newItem]);
  return newItem;
};

export const updatePerformance = (rec: PerformanceRecord) => {
  const items = getAllPerformance();
  const index = items.findIndex(r => r.id === rec.id);
  if (index !== -1) {
    items[index] = rec;
    saveItems(KEYS.PERFORMANCE, items);
  }
};

// Requests
export const getAllRequests = (): HRRequest[] => getItems<HRRequest>(KEYS.REQUESTS);

export const getRequestsByEmployee = (empId: number): HRRequest[] => 
  getAllRequests().filter(r => r.employee_id === empId);

export const addRequest = (req: Omit<HRRequest, 'id' | 'created_at' | 'updated_at'>) => {
  const items = getAllRequests();
  const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
  const now = new Date().toISOString();
  const newItem = { ...req, id: newId, created_at: now, updated_at: now };
  saveItems(KEYS.REQUESTS, [...items, newItem]);
  return newItem;
};

export const updateRequest = (req: HRRequest) => {
  const items = getAllRequests();
  const index = items.findIndex(r => r.id === req.id);
  if (index !== -1) {
    items[index] = { ...req, updated_at: new Date().toISOString() };
    saveItems(KEYS.REQUESTS, items);
  }
};

export const getStats = () => {
  const employees = getEmployees();
  const positions = getPositions();
  const requests = getItems<HRRequest>(KEYS.REQUESTS);
  const tasks = getItems<OnboardingTask>(KEYS.TASKS);

  const onboardingTasks = tasks.filter(t => t.status !== 'Done' && (t.category === 'Onboarding' || !t.category));
  const separationTasks = tasks.filter(t => t.status !== 'Done' && t.category === 'Separation');
  
  // Count unique employees
  const onboardingActive = new Set(onboardingTasks.map(t => t.employee_id)).size;
  const separationActive = new Set(separationTasks.map(t => t.employee_id)).size;
  const performanceActive = new Set(tasks.filter(t => t.status !== 'Done' && t.category === 'Performance').map(t => t.employee_id)).size;

  return {
    totalEmployees: employees.length,
    openPositions: positions.filter(p => p.status === 'Open').length,
    pendingRequests: requests.filter(r => r.status === 'New' || r.status === 'In Progress').length,
    onboardingActive,
    separationActive,
    performanceActive
  };
};
