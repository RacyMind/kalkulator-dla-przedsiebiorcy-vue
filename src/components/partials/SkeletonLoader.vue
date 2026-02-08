<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md"
         style="max-width: 1200px; margin: 0 auto;">
      <div class="col-12 col-lg-5">
        <q-card flat
                bordered
                class="bg-surface"
                style="border-radius: var(--radius-md)">
          <q-card-section>
            <q-skeleton type="text"
                        width="40%"
                        class="q-mb-md" />
            <q-skeleton type="QInput"
                        class="q-mb-sm" />
            <q-skeleton type="QInput"
                        class="q-mb-sm" />
            <q-skeleton type="QInput"
                        class="q-mb-sm" />
            <q-skeleton type="QBtn"
                        width="100%"
                        class="q-mt-md" />
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-lg-7">
        <q-card flat
                bordered
                class="bg-surface"
                style="border-radius: var(--radius-md)">
          <q-card-section>
            <q-skeleton type="text"
                        width="30%"
                        class="q-mb-md" />
            <q-skeleton type="text"
                        class="q-mb-xs" />
            <q-skeleton type="text"
                        class="q-mb-xs" />
            <q-skeleton type="text"
                        class="q-mb-xs" />
            <q-skeleton type="text"
                        class="q-mb-xs" />
            <q-skeleton type="text"
                        width="60%"
                        class="q-mb-md" />
            <q-skeleton type="rect"
                        height="150px" />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>
