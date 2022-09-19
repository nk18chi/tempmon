jest.setTimeout(30000);
beforeEach(() => {
  jest.clearAllMocks();
});

process.env.TEMPMON_WATCH_DIRECTORY = "./test/src/**";
process.env.TEMPMON_TEMPLATE_DIRECTORY = "./test/template";
