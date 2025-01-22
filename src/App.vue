<script setup lang="ts">
import io from "socket.io-client";
import { onUpdated, ref,watch, watchEffect } from "vue";
import { convertDateToString } from './utils/utils';

interface IDataMessage {
  message: string;
  nickname: string;
  color?:string;
  id: string;
  createdAt:Date;
}
const BACKEND_URL = import.meta.env.VITE_BACKEND_ULR;
const socket = io(BACKEND_URL);

const messageEmit = ref("");
const messages = ref<IDataMessage[]>([]);

const nickname = ref(localStorage.getItem("nickname") || "" );
const color = ref(localStorage.getItem("color") || "#FF0000");
const userId = ref<string>("");

const containerMsgRef = ref<HTMLDivElement | null>(null);

socket.on("message", (data) => {
  // Actualiza la interfaz de usuario con los datos recibidos

  userId.value = socket.id!;
  messages.value.push(data);

});


const handleEmit = () => {
  if (!messageEmit.value.trim()) return;

  socket.emit("message", {
    message: messageEmit.value,
    nickname: nickname.value,
    color: color.value,
    createdAt: new Date().toISOString(),
    id: socket.id,

  });
  messageEmit.value = "";
};
watch(nickname, (newVal) => {
  localStorage.setItem("nickname", newVal);
});
watch(color, (newVal) => {
  localStorage.setItem("color", newVal);
});

onUpdated(()=>{

 handleScroll();
})



const handleScroll = ()=>{
  if (containerMsgRef.value) {
    const positionY = containerMsgRef.value?.scrollHeight;
    setTimeout(() => {
      containerMsgRef.value?.scrollTo({ top: positionY, behavior: "smooth" });
    }, 300);
  }
}


</script>

<template>
  <main class="w-full h-screen flex justify-center items-center bg-gray-800">
    <div
      class="w-full md:w-[450px] md:h-[70vh] h-full md:shadow md:rounded-lg bg-white flex flex-col justify-start items-center"
    >
      <section
        ref="containerMsgRef"
        class="w-full flex-1 bg-hero-pattern flex flex-col justify-start items-start p-3 overflow-y-auto gap-3"
      >
        <div
          :class="['flex flex-col bg-[#fcfcfce5] px-2 rounded-lg w-full', { 'self-end': nickname.toLowerCase() === data.nickname.toLowerCase() }]"
          v-for="data in messages"
          :key="data.message"
        >
          <span :style="`color: ${data.color ?? '#000000'}`" :class="['text-lg font-semibold',{'text-right':nickname.toLowerCase() === data.nickname.toLowerCase()}]">{{ data.nickname }}</span>
          <span :class="['p-2 bg-white rounded-lg text-sm shadow w-auto',{'self-end':nickname.toLowerCase() === data.nickname.toLowerCase()}]">{{ data.message }}</span>
          <span :class="['text-xs mt-1',{'text-right':nickname.toLowerCase() === data.nickname.toLowerCase()}]">{{ convertDateToString(new Date(data.createdAt)) }}</span>
        </div>
      </section>
     <div class="w-full flex justify-start items-center gap-2 p-2">
      <input
        placeholder="Escribe tu nickname"
        class="flex-1 border h-9 px-3 outline-none rounded-lg"
        v-model="nickname"
        :style= " `color: ${color}`"
      />
      <input type="color" v-model="color" class="w-10 h-10 rounded-full outline-none"/>
     </div>
      <form
        @submit.prevent="handleEmit"
        class="w-full h-[50px] bg-white flex gap-3 "
      >
        <input
          :disabled="!nickname.trim()"
          autofocus
          v-model="messageEmit"
          class="flex-1 h-full p-2 outline-none disabled:bg-gray-200"
          placeholder="Escribe tu mensaje..."
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
