<template>
  <q-card style="width: auto; max-width: 600px">
    <q-card-section>
      <p class="text-justify">
        Cześć! Kalkulator finansowy (poprzednio kalkulator dla przedsiębiorcy) rozwijam hobbystycznie w tak zwanych „po
        godzinach”. W ramach projektu rozwijam swoją i Twoją wiedzę księgową. Jeżeli uważasz to narzędzie za
        wartościowe, postaw mi wirtualną kawę :)
      </p>
      <q-btn
        label="Postaw mi kawę"
        icon="o_free_breakfast"
        no-caps
        style="width: 75%;max-width:180px"
        color="primary"
        type="a"
        href="https://buycoffee.to/lukaszsocha"
        class="q-mb-md q-mx-auto text-center block"
        target="_blank"/>
      <p class="text-justify">
        Będzie mi miło jak udostępnisz kalkulator finansowy i pomożesz w jego promocji.
      </p>
      <div class="column items-center">
        <q-btn
          label="Facebook"
          no-caps
          class="q-mb-sm"
          style="width: 75%;max-width:180px"
          color="primary"
          outline
          type="a"
          target="_blank"
          :href="`https://www.facebook.com/sharer/sharer.php?u=${url}`"
        />
        <q-btn
          label="LinkedIn"
          no-caps
          class="q-mb-sm"
          style="width: 75%;max-width:180px"
          color="primary"
          outline
          type="a"
          target="_blank"
          :href="`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${$constants.APP.NAME}`"
        />
        <q-btn
          label="Twitter"
          no-caps
          class="q-mb-md"
          style="width: 75%;max-width:180px"
          color="primary"
          outline
          type="a"
          target="_blank"
          :href="`http://twitter.com/share?url=${url}&text=${$constants.APP.NAME}&hashtags=wynagrodzenie,finanse,kalkulator`"
        />
      </div>
      <p  class="q-mb-none text-justify">
        Dzięki za wsparcie! Kalkulator był, jest i będzie darmowy.
      </p>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  data () {
    return {
      url: 'https://kalkulatorfinansowy.app',
    }
  },
}
</script>

<style scoped>

</style>
