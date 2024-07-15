<template>
  <v-app>
    <v-main class="mt-1">
      <v-container>
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'AppContainer',
};
</script>
