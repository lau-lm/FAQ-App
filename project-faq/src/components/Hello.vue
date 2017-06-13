<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col s9 grey lighten-2">
        <ul class="collection">
          <li class="collection-item avatar" v-for="item in datas.listFAQ">
            <i class="material-icons circle teal">help</i>
            <span class="title">{{item.answer}}</span>
            <p v-if="item.viewResponse === true">
              <a @click="callChangeViewResponse(item.id, false)"> <i class="material-icons">visibility</i><span>Show response</span></a>
            </p>
            <p v-if="item.viewResponse === false">
              <a @click="callChangeViewResponse(item.id, true)"> <i class="material-icons">visibility_off</i> </a> {{item.response}}
            </p>

            <a class="secondary-content" @click="callRemove(item.id)"><i class="material-icons">delete</i></a>
          </li>
        </ul>
      </div>

      <div class="col s3 teal darken-2">
        <form>
          <div class="row">
            <div class="col s12">

              <div class="input-field inline">
                <input id="answer" type="text" name="answer" v-model="datas.newFAQ.answer" v-validate="'required|min:8|max:300'">
                <span v-show="errors.has('answer')" class="help is-danger">{{ errors.first('answer') }}</span>
                <label for="answer">Answer</label>
              </div>




              <div class="input-field inline">
                <input id="response" type="text" v-model="datas.newFAQ.response" name="response" v-validate="'required|min:4'">
                <span v-show="errors.has('response')" class="help is-danger">{{ errors.first('response') }}</span>
                <label for="response">Response</label>
              </div>
              <a class="waves-effect waves-light btn" @click="callAddFAQ()"><i class="material-icons left">add</i>Add a question</a>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import { Store } from '@/Store.js'


  export default {
    name: 'hello',
    data() {
      return {
        datas: Store.datas,
        error: ''
      }
    },
    created() {
      Store.loadDatas()
    },
    methods: {
      callAddFAQ() {
        Store.addFAQ()
      },
      callRemove(id) {
        console.log('call remove')
        Store.remove(id)
      },
      callChangeViewResponse(id, visibility) {
        Store.changeViewResponse(id, visibility)
      }
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .col {
    height: 100vh;
  }
  
  .btn {
    margin-top: 2vh;
  }
</style>