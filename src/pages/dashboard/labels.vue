<template>
  <div>
    <cc-subheader-label v-if="labels" :numItem="labels.length" />
    <div class="row main">
      <div class="col-3">
        <cc-left-panel-label-editor v-if="labels" :labels="labels" />
      </div>
      <div class="col-9">
        <div class="main-card row">
          <div class="col-12 bg-white">
            <q-field>
              <q-input stack-label="Slug (ID)" v-model="label.uid" :disable="true" />
              <q-input
                class="q-mt-md"
                stack-label="Nom du label"
                @input="onLabelTextChange"
                v-model="label.text" />
            </q-field>
          </div>
          <template v-if="label._id">
            <div class="q-mt-md col-4">
              <div class="label-form-card">
                <p>Image illustrant le label</p>
                <img
                  v-if="label.photo"
                  :src="getPhoto"
                  style="width: 200px;" />
                  <q-uploader stack-label="Modifier la photo"
                            :url="uploadUrl"
                            :headers="setHeaders()"
                            :additional-fields="setBody('photos')"
                            name="file"
                            @fail="fail"
                            @uploaded="onUploaded"/>
              </div>
            </div>
            <div class="q-mt-md col-4">
              <div class="label-form-card">
                <p>Icône illustrant le label</p>
                <img
                  v-if="label.icon"
                  :src="getIcon"
                  style="width: 50px;" />
                <q-uploader stack-label="Modifier l'icône"
                            :url="uploadUrl"
                            :headers="setHeaders()"
                            :additional-fields="setBody('icons')"
                            name="file"
                            @fail="fail"
                            @uploaded="onUploaded"/>
              </div>
            </div>
            <div class="q-mt-md col-4">
              <div class="label-form-card">
                <q-toggle
                  v-model="label.isObstacle"
                  color="pink"
                  label="L'objet représente un obstacle"/>
              </div>
            </div>
            <div class="col-12 q-pt-md">
              <div class="q-pa-md">
                <q-table
                  title="Propriétés"
                  :data="label.properties"
                  :columns="labelPropsColumns"
                  row-key="name"
                >
                  <template slot="top-right" slot-scope="props">
                    <q-btn @click="onAddLabelProperty()" label="ajouter" />
                  </template>

                  <q-tr v-if="currentProperty" slot="bottom-row" slot-scope="props">
                    <q-td colspan="100%" style="text-align: right;">
                      <q-btn size="sm" color="grey" label="annuler"
                              @click="onCancelEditLabelProperty()"
                              style="margin-right: 12px;" />
                      <q-btn size="sm" color="pink" label="valider"
                              @click="onSaveLabelProperty()"
                              style="margin-right: 12px;"  />
                      <q-btn size="sm" color="warning" label="supprimer"
                              @click="onDeleteLabelProperty()" />
                    </q-td>
                  </q-tr>

                  <q-tr @click.native="onEditLabelProperty(props.row)"
                        slot="body" slot-scope="props" :props="props">
                    <q-td key="name" :props="props">
                      <template v-if="!props.row.edit">
                        {{ props.row.name }}
                      </template>
                      <template v-else>
                        <q-input autofocus v-model="props.row.name" />
                      </template>
                    </q-td>
                    <q-td key="val_1" :props="props">
                      <template v-if="!props.row.edit">
                        {{ props.row.val_1 }}
                      </template>
                      <template v-else>
                        <q-input v-model="props.row.val_1" />
                      </template>
                    </q-td>
                    <q-td key="val_2" :props="props">
                      <template v-if="!props.row.edit">
                        {{ props.row.val_2 }}
                      </template>
                      <template v-else>
                        <q-input v-model="props.row.val_2" />
                      </template>
                    </q-td>
                    <q-td key="val_3" :props="props">
                      <template v-if="!props.row.edit">
                        {{ props.row.val_3 }}
                      </template>
                      <template v-else>
                        <q-input v-model="props.row.val_3" />
                      </template>
                    </q-td>
                  </q-tr>
                </q-table>
              </div>
            </div>
          </template>
        </div>
        <div class="col-12" style="text-align: center;">
          <q-btn  label="enregistrer"
                  @click="onSave()"
                  style="margin-top: 10px;"
                  color="dark">
          </q-btn>
          <q-btn  label="supprimer"
                  v-if="label._id"
                  @click="onDelete()"
                  style="margin-top: 10px; margin-left: 12px;"
                  color="red">
          </q-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint no-useless-escape: 0 */
import omitDeep from 'omit-deep-lodash';
import { clone } from 'quasar';
import _ from 'lodash';
import { mapGetters } from 'vuex';
import slugify from 'slugify';

import { LABELS, LABELS_CREATE, LABELS_UPDATE, LABELS_DELETE } from '../../constants/graphql';

import CcLeftPanelLabelEditor from 'components/cc-left-panel-label-editor';
import CcSubheaderLabel from 'components/cc-subheader-label';

export default {
  name: 'DashboardLabels',
  components: {
    CcLeftPanelLabelEditor,
    CcSubheaderLabel,
  },
  data() {
    return {
      isObstacle: false,
      uploadUrl: `${process.env.API_URL}/upload-label`,
      labelPropsColumns: [
        {
          name: 'name',
          label: 'Nom',
          field: 'name',
          align: 'left',
          style: 'width: 70%',
        },
        {
          name: 'val_1',
          align: 'center',
          label: 'Valeur 1',
          field: 'val_1',
        },
        {
          name: 'val_2',
          label: 'Valeur 2',
          field: 'val_2',
        },
        {
          name: 'val_3',
          label: 'Valeur 3',
          field: 'val_3',
        },
      ],
      currentProperty: null,
    };
  },
  computed: {
    ...mapGetters({
      label: 'label/getCurrentLabel',
    }),
    getPhoto() {
      return `${process.env.API_URL}/img/labels/photos/${this.label.photo}`;
    },
    getIcon() {
      return `${process.env.API_URL}/img/labels/icons/${this.label.icon}`;
    },
  },
  mounted() {
  },
  methods: {
    async onSave() {
      try {
        if (this.label._id) {
          await this.$apollo.mutate({
            mutation: LABELS_UPDATE,
            variables: {
              id: this.label._id,
              uid: this.label.uid,
              text: this.label.text,
              photo: this.label.photo,
              icon: this.label.icon,
              isObstacle: this.label.isObstacle,
              properties: omitDeep(this.label.properties, ['__typename', '__index']),
            },
          });
        } else {
          const newLabel = await this.$apollo.mutate({
            mutation: LABELS_CREATE,
            variables: {
              uid: this.label.uid,
              text: this.label.text,
            },
          });
          const { data } = newLabel;
          this.$store.commit('label/SET_CURRENT_LABEL', {
            _id: data.createLabel._id,
            uid: this.label.uid,
            text: this.label.text,
          });
        }
        this.$apollo.queries.labels.refresh();
        this.$q.notify({ message: this.$t('global.updateDone'), type: 'positive' });
      } catch (error) {
        console.log(error);
        this.$q.notify({ message: this.$t('global.error'), type: 'negative' });
      }
    },
    async onDelete() {
      this.$q.dialog({
        title: 'Suppression',
        message: 'Etes-vous sûr de vouloir supprimer ce label ?',
        ok: {
          color: 'pink',
          label: 'oui',
        },
        cancel: {
          color: 'dark',
          label: 'non',
        },
        preventClose: true,
      }).then(() => {
        this.$apollo.mutate({
          mutation: LABELS_DELETE,
          variables: {
            id: this.label._id,
          },
        }).then(() => {
          this.labels = _.reject(this.labels, label => label._id === this.label._id);
          this.$store.commit('label/SET_CURRENT_LABEL', null);
        }).catch(() => {
          this.$q.notify({ message: this.$t('global.error'), type: 'negative' });
        });
      }).catch(() => {
      });
    },
    onLabelTextChange() {
      if (!this.label._id) {
        const slug = slugify(this.label.text, {
          replacement: '-',
          remove: /[*+~.()'"!:@?]/g,
          lower: true,
          strict: false,
          trim: true,
        });
        this.label.uid = slug;
      }
    },
    setHeaders() {
      return { Authorization: `Bearer ${this.$localStorage.get('default_auth_token')}` };
    },
    setBody(type) {
      return [
        {
          name: 'type',
          value: type,
        },
      ];
    },
    fail(file, xhr) {
      console.log('Fail: ', file);
      console.log('Fail: ', xhr);
    },
    onUploaded(file, xhr) {
      if (xhr.status === 201) {
        const response = JSON.parse(xhr.response);
        const type = (response.type === 'photos') ? 'photo' : 'icon';
        this.label[type] = response.filename;
        this.onSave();
      }
    },
    onEditLabelProperty(property) {
      this.currentProperty = property;
      property.edit = true;
    },
    onCancelEditLabelProperty() {
      if (this.currentProperty) {
        if (this.currentProperty.name.length === 0) {
          this.label.properties = _.reject(
            this.label.properties,
            row => row === this.currentProperty,
          );
        }
        delete this.currentProperty.edit;
        this.currentProperty = null;
      }
    },
    onAddLabelProperty() {
      if (!this.currentProperty) {
        this.label.properties.push({
          name: '',
          val_1: '',
          val_2: '',
          val_3: '',
          edit: true,
        });
        this.currentProperty = _.last(this.label.properties);
      }
    },
    onSaveLabelProperty() {
      delete this.currentProperty.edit;
      _.each(this.label.properties, (labelPropsRows) => {
        delete labelPropsRows.__typename;
        delete labelPropsRows.__index;
      });
      this.currentProperty = null;
    },
    onDeleteLabelProperty() {
      if (this.currentProperty) {
        this.label.properties = _.reject(
          this.label.properties,
          properties => properties === this.currentProperty,
        );
        this.onSaveLabelProperty();
      }
    },
  },
  apollo: {
    labels: {
      query: LABELS,
      fetchPolicy: 'no-cache',
      update(data) {
        return clone(data.Labels);
      },
    },
  },
};
</script>

<style lang="stylus">
  @import '~variables'
  .main-card
    border-radius 2px
    width 100%
    max-width 1200px
    padding 20px
    .label-form-card
      display flex
      flex-direction column
      justify-content space-between
      align-items center
      height 295px
</style>
