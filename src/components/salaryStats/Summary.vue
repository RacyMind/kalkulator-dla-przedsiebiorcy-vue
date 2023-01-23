<template>
  <div>
    <ListRow
      name="Minimalne wynagrodzenie"
      :value="pln(3490)"
    />
    <ListRow
      class="bg-teal-1"
      name="Minimalna stawka godzinowa"
      :value="pln(22.8)"
    />
    <ListRow
      name="Przeciętne wynagrodzenie (ZUS)*"
      :value="pln(5167.47)"
    />
    <ListRow
      class="bg-teal-1"
      name="Przeciętne wynagrodzenie (GUS)**"
      :value="pln(6965,94)"
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
        ** Dane opublikowane przez GUS za IV kwartał 2022 r.
      </p>
      <p
        class="q-mb-none">
        Ostatnia aktualizacja: 23.01.2023 r.
      </p>
    </div>
  </div>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
import {pln} from 'src/use/currencyFormat'
import ListRow from 'components/partials/ListRow.vue'

export default defineComponent({
  components: {
    ListRow,
  },
  setup() {
    return {
      pln,
    }
  },
})
</script>
