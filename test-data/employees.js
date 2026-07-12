// Test employee data for OrangeHRM automation tests
export const employees = {
  adminUser: {
    name: "Admin",
    username: "Admin",
    firstName: "Admin",
    lastName: "OrangeHRM"
  },
  paulHerald: {
    name: "Paul Herald",
    firstName: "Paul",
    lastName: "Herald",
    employeeId: "0001"
  },
  fionaGrace: {
    name: "Fiona Grace",
    firstName: "Fiona",
    lastName: "Grace",
    employeeId: "0002"
  },
  antoniGenefer: {
    name: "Antoni Genefer",
    firstName: "Antoni",
    lastName: "Genefer",
    employeeId: "0003"
  },
  barbaraJane: {
    name: "Barbara Jane",
    firstName: "Barbara",
    lastName: "Jane",
    employeeId: "0004"
  },
}

// Pay grade test data
export const payGrades = {
  gradeA: { name: "Grade A" },
  gradeB: { name: "Grade B" },
  gradeC: { name: "Grade C" },
}

// Job title test data
export const jobTitles = {
  softwareEngineer: { title: "Software Engineer", description: "Develops software systems" },
  qaEngineer: { title: "QA Engineer", description: "Tests software quality" },
  projectManager: { title: "Project Manager", description: "Manages project delivery" },
}

// Leave types available in OrangeHRM demo (Admin configured)
export const leaveTypes = {
  canVacation: "CAN - Vacation",
  canPersonal: "CAN - Personal",
  canBereavement: "CAN - Bereavement",
  canMaternity: "CAN - Matternity",
}

// Leave statuses in the demo
export const leaveStatuses = {
  pendingApproval: "Pending Approval",
  scheduled: "Scheduled",
  taken: "Taken",
  rejected: "Rejected",
  cancelled: "Cancelled",
}
