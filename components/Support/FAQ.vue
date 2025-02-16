<template>
  <div class="max-w-5xl mx-auto">
    <h2 class="text-4xl font-extrabold mb-8 text-center">سوالات متداول</h2>
    <div
      v-for="(item, index) in faqList.data"
      :key="index"
      class="space-y-5 mb-10 last:mb-0"
    >
      <div class="gap-x-4 mt-4 border-b pb-3 border-gray-300 !hidden lg:!flex">
        <img
          src="https://dl.ok-ex.io/asset/svg/okex.svg"
          width="32"
          height="32"
          alt="okex-faq"
        />
        <h2 class="!text-sm !font-normal lg:!text-3xl lg:!font-semibold">
          {{ item.category }}
        </h2>
      </div>

      <div class="flex gap-3 flex-col">
        <h3 class="!text-sm !font-normal lg:!text-2xl lg:!font-semibold">
          {{ item.children[0].category }}
        </h3>
        <!-- Items -->
        <div
          v-for="(child, index) in item.children[0].rows"
          :key="index"
          class="bg-white shadow-md rounded-lg"
        >
          <button
            class="w-full flex items-center justify-between p-4 focus:outline-none"
            @click="toggleItem(child._id)"
            aria-expanded="false"
            :aria-controls="`content-${child._id}`"
            :id="`faq-button-${child._id}`"
          >
            <span class="text-lg font-semibold">
              {{ child.question }}
            </span>
            <svg
              :id="`icon-plus-${child._id}`"
              class="w-6 h-6 text-gray-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <!-- Plus Icon Path -->
              <path
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              />
            </svg>
            <svg
              :id="`icon-minus-${child._id}`"
              class="w-6 h-6 text-gray-600 hidden"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <!-- Minus Icon Path -->
              <path d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" />
            </svg>
          </button>
          <div
            :id="`content-${child._id}`"
            class="text-gray-700 overflow-hidden max-h-0 transition-all duration-500"
            role="region"
            :aria-labelledby="`faq-button-${child._id}`"
          >
            <p class="p-4">
              {{ child.answer }}
            </p>
          </div>
        </div>
      </div>
      <!-- Add more items as needed -->
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: faqList }: any = await useFetch("/api/faq/list");
function toggleItem(id: string) {
  const content = document.getElementById(`content-${id}`)!;
  const iconPlus = document.getElementById(`icon-plus-${id}`)!;
  const iconMinus = document.getElementById(`icon-minus-${id}`)!;

  if (content.style.maxHeight) {
    content.style.maxHeight = null as any;
    // arrow.classList.remove('rotate-180');
  } else {
    content.style.maxHeight = content.scrollHeight + "px";
    // arrow.classList.add('rotate-180');
  }

  //   setTimeout(() => {
  //     content.classList.toggle('hidden');
  //   }, 300);
  iconPlus.classList.toggle("hidden");
  iconMinus.classList.toggle("hidden");
}
</script>
