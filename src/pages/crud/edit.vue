<template>
  <div class="main-card">
    <div class="row no-wrap">
      <div v-if="message" class="col bg-white padding">
        <h4>
          <q-icon name="list" /> {{ $t('cobot.texts') }}
        </h4>
        <q-field orientation="vertical">
          <div v-for="(text, index) in message.text" :key="index">
            <q-input :prefix=inputNumber(index)
                     v-model="text.text"
                     :placeholder="$t('cobot.newMessage')"
                     @blur="update"
                     :after="[
                      {
                        icon: 'remove_circle',
                        content: true,
                        handler() {
                          onClearMainText(index);
                        }
                      }
                    ]"
                    style="padding-top: 20px;"/>
          </div>
          <q-btn icon="create"
                 color="secondary"
                 :label="$t('cobot.btnAddText')"
                 @click="addText(message.text)"
                 style="margin-top: 20px;"/>
        </q-field>
      </div>
    </div>

    <div class="row no-wrap" style="padding-top: 20px">
      <div v-if="message" class="col bg-white padding">
        <h4>
          <q-icon name="touch_app" /> {{ $t('cobot.interactions') }}
        </h4>
        <div v-for="(attachment, attachmentsIndex) in message.attachments"
               :key="attachmentsIndex">
          <q-field
            icon="settings_input_component"
            :label="$t('cobot.api')"
            orientation="vertical"
            :helper="$t('cobot.interactionsHelper')"
            style="padding-top: 35px">
            <q-input  v-model="attachment.callback"
                      :placeholder="$t('cobot.apiTarget')"
                      @blur="update" />
          </q-field>

          <q-field
            icon="insert_photo"
            :label="$t('cobot.image')"
            orientation="vertical"
            style="padding-top: 35px">
            <img v-bind:src="attachment.image" />
            <q-input  v-model="attachment.image"
                      :placeholder="$t('cobot.imageUrl')"
                      @blur="update"
                      :after="[
                        {
                          icon: 'remove_circle',
                          content: true,
                          handler() {
                            onClearImage(attachmentsIndex);
                          }
                        }
                      ]" />
          </q-field>

          <q-field
            icon="list"
            :label="$t('cobot.texts')"
            orientation="vertical"
            style="padding-top: 35px">
              <div v-for="(text, index) in attachment.text" :key="index">
                <q-input :prefix=inputNumber(index)
                          v-model="text.text"
                          :placeholder="$t('cobot.newMessage')"
                          @blur="update"
                          :after="[
                            {
                              icon: 'remove_circle',
                              content: true,
                              handler() {
                                onClearAttachmentText(attachmentsIndex, index);
                              }
                            }
                          ]"
                          style="padding-top: 20px;"/>
              </div>
              <q-btn icon="create"
                    color="secondary"
                    :label="$t('cobot.btnAddText')"
                    @click="addText(attachment.text)"
                    style="margin-top: 20px;"/>
          </q-field>

          <q-field
            icon="settings"
            :label="$t('cobot.actions')"
            orientation="vertical"
            style="padding-top: 35px">
              <div>
                <q-btn v-for="(action, btnIndex) in attachment.actions" :key="btnIndex"
                       icon-right="delete"
                       @click="onDeleteActionBtn(attachmentsIndex, btnIndex)"
                       rounded
                       color="primary"
                       style="margin-right: 10px;"
                       :label=action.text />
              </div>
              <q-btn icon="create"
                    color="secondary"
                    :label="$t('cobot.btnAddAction')"
                    @click="addActionBtn(attachmentsIndex)"
                    style="margin-top: 20px;"/>
          </q-field>

        </div>
      </div>
    </div>
  </div>
</template>

<style>
</style>

<script>
import omitDeep from 'omit-deep-lodash';
import _ from 'lodash';
import { clone } from 'quasar';
import CcDataTable from 'components/cc-data-table';
import { ACTIONS_QUERY, MESSAGE_QUERY, MESSAGE_UPDATE } from '../../constants/graphql';

export default {
  name: 'CobotIndex',
  components: {
    CcDataTable,
  },
  data() {
    return {
      id: this.$route.params.id,
      message: {},
    };
  },
  methods: {
    inputNumber: v => (`${(v + 1)} - `),
    addText(textEntry) {
      textEntry.push({
        text: '',
      });
    },
    addActionBtn(attachmentsIndex) {
      const items = [];
      const currentActionsIds = _.map(this.message.attachments[0].actions, 'id');
      const actions = _.reject(this.Actions, action => currentActionsIds.indexOf(action.id) > -1);
      _.each(actions, (action) => {
        items.push({
          label: action.text,
          value: {
            text: action.text,
            id: action.id,
          },
        });
      });
      this.$q.dialog({
        title: this.$t('cobot.dialog.actions.title'),
        message: this.$t('cobot.dialog.actions.message'),
        color: 'primary',
        ok: true,
        cancel: true,
        preventClose: true,
        options: {
          type: 'radio',
          model: 'opt2',
          items,
        },
      }).then((data) => {
        this.message.attachments[attachmentsIndex].actions.push(data);
        this.update();
      });
    },
    update() {
      let message = clone(this.message);
      message = omitDeep(message, ['__typename', 'id', 'name', 'attachments']);
      message.text = _.reject(message.text, text => text.text.length === 0);

      let attachments = clone(this.message.attachments);
      const actions = [];
      _.each(attachments[0].actions, (action) => {
        actions.push({
          id: action.id,
        });
      });

      attachments = omitDeep(attachments, ['__typename', 'actions']);

      this.$apollo.mutate({
        mutation: MESSAGE_UPDATE,
        variables: {
          id: this.message.id,
          message: message.text,
          attachments,
          actions,
        },
      }).then(() => {
        this.$q.notify(this.$t('global.updateDone'));
      }).catch((error) => {
        console.log(error);
      });
    },
    onDeleteActionBtn(attachmentsIndex, btnIndex) {
      this.$q.dialog({
        title: this.$t('global.confirm'),
        message: this.$t('cobot.confirm.deleteAction'),
        ok: {
          label: this.$t('global.yes'),
        },
        cancel: {
          color: 'negative',
          label: this.$t('global.no'),
        },
        preventClose: true,
      }).then(() => {
        this.message.attachments[attachmentsIndex].actions.splice(btnIndex, 1);
        this.update();
      }).catch(() => {
      });
    },
    onClearMainText(index) {
      this.$q.dialog({
        title: this.$t('global.confirm'),
        message: this.$t('cobot.confirm.delete'),
        ok: {
          label: this.$t('global.yes'),
        },
        cancel: {
          color: 'negative',
          label: this.$t('global.no'),
        },
        preventClose: true,
      }).then(() => {
        this.message.text.splice(index, 1);
        this.update();
      }).catch(() => {
      });
    },
    onClearAttachmentText(attachmentsIndex, index) {
      this.$q.dialog({
        title: this.$t('global.confirm'),
        message: this.$t('cobot.confirm.delete'),
        ok: {
          label: this.$t('global.yes'),
        },
        cancel: {
          color: 'negative',
          label: this.$t('global.no'),
        },
        preventClose: true,
      }).then(() => {
        this.message.attachments[attachmentsIndex].text.splice(index, 1);
        this.update();
      }).catch(() => {
      });
    },
    onClearImage(attachmentsIndex) {
      this.$q.dialog({
        title: this.$t('global.confirm'),
        message: this.$t('cobot.confirm.delete'),
        ok: {
          label: this.$t('global.yes'),
        },
        cancel: {
          color: 'negative',
          label: this.$t('global.no'),
        },
        preventClose: true,
      }).then(() => {
        this.message.attachments[attachmentsIndex].image = null;
        this.update();
      }).catch(() => {
      });
    },
  },
  apollo: {
    Actions: {
      query: ACTIONS_QUERY,
    },
    message: {
      query: MESSAGE_QUERY,
      variables() {
        return {
          id: this.id,
        };
      },
      update(data) {
        return clone(data.Message);
      },
    },
  },
};
</script>

<style lang="stylus">
  @import '~variables'
  h4
    -webkit-margin-before: 0
    -webkit-margin-after: 2px
    color #979797
  .padding
    padding 15px
  .main-card
    border-radius 2px
    width 65vw
    max-width 1200px
  .title
    color: $tertiary
  .number
    color: $tertiary

</style>
