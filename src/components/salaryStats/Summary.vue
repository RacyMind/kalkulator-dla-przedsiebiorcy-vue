<template>
  <div>
    <ListRow
      name="Minimalne wynagrodzenie"
      :value="pln(3010)"
    />
    <ListRow
      class="bg-teal-1"
      name="Minimalna stawka godzinowa"
      :value="pln(19.70)"
    />
    <ListRow
      name="Przeciętne wynagrodzenie (ZUS)*"
      :value="pln(5167.47)"
    />
    <ListRow
      class="bg-teal-1"
      name="Przeciętne wynagrodzenie (GUS)**"
      :value="pln(5657)"
    />
    <div
      class="q-pa-md text-grey text-justify"
      style="font-size:0.8rem;">
      <p class="q-mb-sm">
        * Przeciętne wynagrodzenie uwzględniane przy obliczaniu podstawy wymiaru świadczeń, to przeciętne wynagrodzenie
        w gospodarce narodowej w poprzednim roku kalendarzowym, ogłaszane corocznie przez Prezesa Głównego Urzędu
        Statystycznego, w formie komunikatu, w Dzienniku Urzędowym Rzeczypospolitej Polskiej "Monitor Polski" w terminie
        do 7 roboczego dnia lutego każdego roku.
      </p>
      <p class="q-mb-sm">
        ** Dane opublikowane przez GUS za III kwartał 2021 r.
      </p>
      <p
        class="q-mb-none">
        Ostatnia aktualizacja: 02.01.2022 r.
      </p>
    </div>
  </div>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
import {pln} from 'src/use/currencyFormat'
import ListRow from 'components/partials/ListRow.vue'

export default defineComponent({
  setup() {
    return {
      pln,
    }
  },
  components: {
    ListRow,
  },
})
</script>
