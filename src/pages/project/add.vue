<template>
  <div class="main-card row justify-center">
    <div class="col-12">
      <h2>Nouveau projet</h2>
    </div>
    <div class="col-12">
      <q-card indent style="background-color: white;">
        <q-card-title>
          <strong>Details du projet</strong>
        </q-card-title>
        <q-card-main>
          <div class="row">
            <div class="col">
            <q-field>
              <q-input stack-label="Nom du projet" v-model="project.name" />
            </q-field>
            </div>
          </div>
        </q-card-main>
        <q-card-actions class="row justify-end actions">
          <q-btn  outline
                  color="primary"
                  align="right"
                  icon="save"
                  label="enregistrer"/>
        </q-card-actions>
      </q-card>
    </div>
    <div class="col-12 padding">
      <q-card indent style="background-color: white;">
        <q-card-title>
          <strong>Question et réponses</strong>
        </q-card-title>
        <q-card-main>
          <div class="row">
            <div class="col-12">
              <q-field>
                <q-input stack-label="Question" v-model="project.question" />
              </q-field>
            </div>
            <div v-for="(answer, index) in project.answers" :key="index"
                 class="col-12 padding">
              <q-field>
                <q-input :stack-label="`réponse ${index+1}`" v-model="answer.text" />
              </q-field>
            </div>
          </div>
        </q-card-main>
        <q-card-actions class="row justify-end actions">
          <q-btn  outline
                  color="primary"
                  align="right"
                  icon="save"
                  label="enregistrer"/>
        </q-card-actions>
      </q-card>
    </div>
    <div class="col-12 padding">
      <q-card style="background-color: white;">
        <q-card-title>
          <strong>Jeux de données à qualifier</strong>
        </q-card-title>
        <q-card-main>
          <div class="row justify-around">
            <div>
              <q-btn color="primary" icon="cloud" label="Importer depuis mon compte Dropbox" />
            </div>
            <div>
              <q-btn color="primary"
                     icon="important_devices"
                     label="Importer depuis mon ordinateur" />
            </div>
          </div>
        </q-card-main>
      </q-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProjectEdit',
  data() {
    return {
      project: {
        name: 'Open Solar Map',
        question: 'Dans quel sens est orienté ce toit ?',
        answers: [
          {
            text: 'le milieu du toit est horizontal',
            order: 0,
          },
          {
            text: 'le milieu du toit est vertical',
            order: 1,
          },
          {
            text: 'ce toit est plat',
            order: 2,
          },
          {
            text: 'je ne sais pas',
            order: 3,
          },
          {
            text: 'ce n\'est pas un toit',
            order: 4,
          },
        ],
      },
    };
  },
};
</script>

<style lang="stylus">
  @import '~variables'
  .main-card
    border-radius 2px
    width 65vw
    max-width 1200px
  .padding
    padding-top: 30px;
  .q-card
    .q-card-container
      padding 15px
</style>
