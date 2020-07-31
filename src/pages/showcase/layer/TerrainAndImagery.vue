<template>
  <q-page class="flex flex-center viewer">
    <vc-viewer>
      <vc-layer-imagery>
        <vc-provider-imagery-tianditu
          :mapStyle="mapStyle"
          token="436ce7e50d27eede2f2929307e6b33c0"
        ></vc-provider-imagery-tianditu>
      </vc-layer-imagery>
    </vc-viewer>
  </q-page>
</template>

<script>
export default {

}
</script>

<style>

</style>
