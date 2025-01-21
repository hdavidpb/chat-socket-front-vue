<script setup lang="ts">
import io from "socket.io-client";
import { ref,watch } from "vue";

interface IDataMessage {
  message: string;
  nickname: string;
  id: string;
}
const socket = io("http://localhost:3000/");

const messageEmit = ref("");
const messages = ref<IDataMessage[]>([]);

const nickname = ref(localStorage.getItem("nickname") || "" );
const userId = ref<string>("");

const containerMsgRef = ref<HTMLDivElement | null>(null);

socket.on("message", (data) => {
  // Actualiza la interfaz de usuario con los datos recibidos

  userId.value = socket.id!;
  messages.value.push(data);
  if (containerMsgRef.value) {
    const positionY = containerMsgRef.value?.scrollHeight;
    setTimeout(() => {
      containerMsgRef.value?.scrollTo({ top: positionY, behavior: "smooth" });
    }, 300);
  }
});


const handleEmit = () => {
  if (!messageEmit.value.trim()) return;

  socket.emit("message", {
    message: messageEmit.value,
    nickname: nickname.value,
    id: socket.id,
  });
  messageEmit.value = "";
};
watch(nickname, (newVal) => {
  localStorage.setItem("nickname", newVal);
});

</script>

<template>
  <main class="w-full h-screen flex justify-center items-center bg-gray-800">
    <div
      class="w-full md:w-[450px] md:h-[70vh] h-full md:shadow md:rounded-lg bg-white flex flex-col justify-start items-center"
    >
      <section
        ref="containerMsgRef"
        class="w-full flex-1 bg-blue-200 flex flex-col justify-start items-start p-3 overflow-y-auto gap-3"
      >
        <div
          :class="['flex flex-col', { 'self-end': nickname.toLowerCase() === data.nickname.toLowerCase() }]"
          v-for="data in messages"
          :key="data.message"
        >
          <span :class="['text-lg font-semibold',{'text-right':nickname.toLowerCase() === data.nickname.toLowerCase()}]">{{ data.nickname }}</span>
          <span class="p-3 bg-white rounded-lg">{{ data.message }}</span>
        </div>
      </section>
      <input
        placeholder="Escribe tu nickname"
        class="w-full border h-8 px-3 outline-none"
        v-model="nickname"
      />
      <form
        @submit.prevent="handleEmit"
        class="w-full h-[70px] bg-white flex gap-3"
      >
        <input
          :disabled="!nickname.trim()"
          autofocus
          v-model="messageEmit"
          class="flex-1 h-full p-2 outline-none disabled:bg-gray-200"
        />
        <button
          :disabled="!nickname.trim() || !messageEmit.trim() "
          class="font-semibold text-blue-500 px-2 disabled:opacity-45"
        >
          Enviar
        </button>
      </form>
    </div>
  </main>
</template>
