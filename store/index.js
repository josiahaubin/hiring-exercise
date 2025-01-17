import { createStore } from "vuex";
import axios from "axios";
import router from "../router";
import createPersistedState from "vuex-persistedstate";

let base = "http://localhost:5000/";

let api = axios.create({
  baseURL: base,
  timeout: 3000
});

const store = createStore({
  state: {
    users: [],
    userId: "",
    user: {}
  },
  getters: {
    users: state => {
      return state.users;
    },
    user: state => {
      return state.user;
    },
    userId: state => {
      return state.userId;
    }
  },
  mutations: {
    setUsers(state, users) {
      state.users = users;
    },
    setUserId(state, data) {
      state.userId = data.user._id;
    },
    setUser(state, user) {
      state.user = user;
    },
    logout(state) {
      (state.user = {}), (state.userId = ""), state.users - [];
    }
  },
  actions: {
    // Get All
    async listUsers({ commit }) {
      try {
        const response = await api.get("user");
        commit("setUsers", response.data);
      } catch (error) {
        console.log(error);
      }
    },
    // Get by Id
    async getUserById({ commit }, payload) {
      try {
        const response = await api.get("user/" + payload._id);
        commit("setUser", response.data);
      } catch (error) {
        console.log(error);
      }
    },
    // Put
    async updateUser({ commit }, payload) {
      try {
        await api.put("user/" + payload._id, {
          username: payload.username,
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
          favoriteColor: payload.favoriteColor,
          birthYear: payload.birthYear
        });
        commit("setUser", payload);
      } catch (error) {
        console.log(error);
      }
    },
    //  Delete
    async deleteUser({ dispatch }, payload) {
      try {
        const response = await api.delete("user/" + payload._id);
        dispatch("listUsers");
        if (response) router.push("/");
      } catch (error) {
        console.log(error);
      }
    },
    // Login
    async authenticate({ commit }, payload) {
      try {
        const response = await api.post("authenticate", payload);
        commit("setUserId", response.data);
        if (response.data.user._id) {
          router.push("/");
        }
      } catch (error) {
        console.log(error);
      }
    },
    //  Reset PW
    async resetPassword({ dispatch }, payload) {
      try {
        await api.put("reset/" + payload._id, { password: payload.password });
        dispatch("getUserById", payload);
        router.push("/");
      } catch (error) {
        console.log(error);
      }
    },
    logout({ commit }) {
      try {
        if (this.state.userId) {
          commit("logout");
          router.push("/login");
        }
      } catch (error) {
        console.log(error);
      }
    }
  },
  plugins: [createPersistedState()]
});

export default store;
