export default defineEventHandler(async (e) => {
  const {
    public: { azapi },
  } = useRuntimeConfig();

  try {
    const data = await $fetch(azapi, {
      headers: {
        Accept: "application/json",
      },
    });
    return data;
  } catch (error) {
    return error;
  }
});
