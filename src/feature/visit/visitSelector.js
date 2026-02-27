// visitSelectors.js

export const selectVisitState = (state) => state.visit;

export const selectVisitList = (state) => state.visit.list;

export const selectVisitCount = (state) => state.visit.count;

export const selectVisitLoading = (state) => state.visit.loading;

export const selectVisitError = (state) => state.visit.error;

export const selectVisitById = (id) => (state) =>
  state.visit.list.find((item) => item.id === id);

export const selectVisitsByEmployeeId = (employeeId) => (state) =>
  state.visit.list.filter(
    (item) => Number(item.employee_id) === Number(employeeId),
  );

export const selectVisitsByLeadId = (leadId) => (state) =>
  state.visit.list.filter((item) => Number(item.lead_id) === Number(leadId));
