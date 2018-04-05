<template>
  <div class="main-card">
    <div class="row no-wrap">
      <div class="col-md-8 q-mr-sm bg-light-blue">
        <q-table
            title="CoBot expressions"
            :data="tableData"
            :columns="columns">
            <template slot="top-right" slot-scope="props">
              <q-search
                hide-underline
                color="secondary"
                v-model="filter"
                class="col-6"
              />
            </template>
        </q-table>
      </div>
      <div class="col-md-4 bg-light-blue">
        <div style="text-align: center">
          <h4 class="title">contributions</h4>
          <h3 class="number">250 002</h3>
        </div>
      </div>
    </div>
    <div class="row q-pt-sm">
      <div class="col bg-light-blue">
        <div class="flex flex-center">
          Another line
        </div>
      </div>
    </div>
  </div>
</template>

<style>
</style>

<script>
export default {
  name: 'DashboardIndex',
  data: () => ({
    columns: [
      {
        name: 'desc',
        required: true,
        label: 'Dessert (100g serving)',
        align: 'left',
        field: 'name',
        sortable: true,
      },
      {
        name: 'calories',
        label: 'Calories',
        field: 'calories',
        sortable: true,
      },
    ],
    tableData: [
      {
        name: 'Frozen Yogurt',
        calories: 159,
        fat: 6.0,
        carbs: 24,
        protein: 4.0,
        sodium: 87,
        calcium: '14%',
        iron: '1%',
      },
    ],
    filter: '',
  }),
};
</script>

<style lang="stylus">
  @import '~variables'
  .main-card
    border-radius 2px
    width 80vw
    max-width 1200px
  .title
    color: $tertiary
  .number
    color: $tertiary

</style>
