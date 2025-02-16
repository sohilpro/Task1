export default defineEventHandler(async (e) => {
  const {
    public: { api },
  } = useRuntimeConfig();

  try {
    const data = await $fetch(api, {
      headers: {
        Accept: "application/json",
      },
    });
    return data;
  } catch (error) {
    return error;
  }
});
