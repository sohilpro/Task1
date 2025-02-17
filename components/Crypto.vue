<template>
  <main>
    <!-- Table Section -->
    <div class="lg:max-w-[85rem] w-full px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <!-- Card -->
      <div class="flex flex-col">
        <div class="-m-1.5">
          <div class="p-1.5 min-w-full lg:inline-block align-middle">
            <div
              class="bg-white border border-gray-200 rounded-xl shadow-sm lg:overflow-hidden"
            >
              <!-- Header -->
              <div class="px-6 py-4 border-b border-gray-200">
                <h2 class="text-xl font-semibold text-gray-800">
                  قیمت ارزهای دیجیتال بر اساس ارزش بازار
                </h2>
                <p class="text-sm text-gray-600">
                  ارزش بازار جهانی ارزهای دیجیتال امروز 1.09 تریلیون دلار است که
                  <span class="text-green-500">0.5</span> درصد تغییر در 24 ساعت
                  گذشته داشته است.
                </p>
              </div>
              <!-- End Header -->

              <!-- Table -->
               <!-- <div class="overflow-x-auto"> -->
              <table
                dir="ltr"
                lang="en"
                class="min-w-full divide-y block lg:inline-table lg:overflow-hidden divide-gray-200"
              >
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      class="px-6  py-3 text-start whitespace-nowrap lg:min-w-64"
                    >
                      <span
                        class="text-xs font-semibold uppercase tracking-wide text-gray-800"
                      >
                        جفت
                      </span>
                    </th>

                    <th
                      scope="col"
                      class="px-6 py-3 text-start whitespace-nowrap"
                    >
                      <span
                        class="text-xs font-semibold uppercase tracking-wide text-gray-800"
                      >
                        تغییر 24 ساعته
                      </span>
                    </th>

                    <th
                      scope="col"
                      class="px-6 py-3 text-start whitespace-nowrap"
                    >
                      <span
                        class="text-xs font-semibold uppercase tracking-wide text-gray-800"
                      >
                        قیمت
                      </span>
                    </th>
                  </tr>
                </thead>

                <tbody v-auto-animate class="divide-y divide-gray-200">
                  <tr v-for="(item, index) in tickers" :key="index">
                    <td class="size-px whitespace-nowrap px-6 py-3">
                      <NuxtLink
                        :to="`https://ok-ex.io/trade/${item.arg.instId
                          .split('-')[0]
                          .toUpperCase()}_${item.arg.instId
                          .split('-')[1]
                          .toUpperCase()}`"
                        target="_blank"
                      >
                        <div class="flex items-center gap-x-3">
                          <img
                            alt=""
                            class="w-5 h-5 xl:w-6 xl:h-6 rounded-full"
                            :src="`https://dl.ok-ex.io/coins/128/color/${item.arg.instId
                              .split('-')[0]
                              .toLowerCase()}.png`"
                          />

                          <span class="font-semibold text-sm text-gray-800">
                            {{ item.arg.instId.split("-")[0].toUpperCase() }}
                          </span>
                        </div>
                      </NuxtLink>
                    </td>
                    <td class="size-px whitespace-nowrap px-6 py-3">
                      <span
                        v-if="
                          percentageChange(
                            item.data[0].last,
                            item.data[0].open24h
                          ) > 0
                        "
                        class="text-sm bg-green-100 px-2 py-1 rounded-lg font-bold text-green-500"
                      >
                        {{
                          percentageChange(
                            item.data[0].last,
                            item.data[0].open24h
                          ).toFixed(2)
                        }}%
                      </span>
                      <span
                        v-else-if="
                          percentageChange(
                            item.data[0].last,
                            item.data[0].open24h
                          ) < 0
                        "
                        class="text-sm bg-red-100 px-2 py-1 rounded-lg font-bold text-red-500"
                      >
                        {{
                          percentageChange(
                            item.data[0].last,
                            item.data[0].open24h
                          ).toFixed(2)
                        }}%
                      </span>

                      <span
                        v-else
                        class="text-sm bg-green-100 px-2 py-1 rounded-lg font-bold text-green-500"
                      >
                        0 %
                      </span>
                    </td>

                    <td class="size-px whitespace-nowrap px-6 py-3">
                      <span class="text-sm text-gray-800 font-semibold"
                        >{{ item.data[0].last }} USDT</span
                      >
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
              <!-- End Table -->
            <!-- </div> -->
          </div>
        </div>
      </div>
      <!-- End Card -->
    </div>
    <!-- End Table Section -->
  </main>
</template>

<script setup lang="ts">
const { $socket } = useNuxtApp();
const tickers = shallowRef<any[]>([]);

onMounted(async () => {
  // Fetch ticker list
  const tickersList: any = await $fetch("/api/tickers/list");
  const symbols = tickersList.tickers.map((item: any) => item.symbol);

  const list = tickersList.tickers.map((t: any) => ({
    arg: {
      channel: "tickers",
      instId: t.symbol,
    },
    data: [
      {
        instId: t.symbol,
        last: t.last,
        open24h: t.open_24h,
      },
    ],
  }));

  tickers.value = list;

  // Prepare WebSocket subscription payload
  const requestPayload = {
    op: "subscribe",
    args: symbols.map((symbol: string) => ({
      channel: "tickers",
      instId: symbol,
    })),
  };

  sendMessage(requestPayload);

  $socket.on("message", async (data: any) => {
    const parseData = JSON.parse(data);

    await debouncedUpdate(parseData);
  });
});

onUnmounted(() => {
  $socket.off("message");
});

const sendMessage = (tickers: any) => {
  $socket.emit("message", JSON.stringify(tickers));
};

const percentageChange = (lastPrice: number, openPrice: number) =>
  ((lastPrice - openPrice) / openPrice) * 100;

// Debounce only the update logic
const debouncedUpdate = useDebounceFn(
  (parseData: any) => {
    if (tickers.value.length !== 0) {
      tickers.value = tickers.value.filter(
        (item) => item.arg.instId !== parseData.arg.instId
      );
    }

    tickers.value.unshift(parseData);
  },
  500,
  { maxWait: 5000 }
);
</script>
