import Vuex from "vuex";
import Cookie from "js-cookie";

const createStore = () => {
  return new Vuex.Store({
    state: {
      authKey: null,
    },
    mutations: {
      setAuthKey(state, authKey) {
        state.authKey = authKey;
      },
      clearAuthKey(state) {
        Cookie.remove("authKey");
        localStorage.removeItem("authKey")
        state.authkey = null;
      },
    },
    actions: {
      nuxtServerInit(vuexContext, context) {
        let cookie;
        if (cookie) {
          cookie = context.req.headers.cookie
            .split(";")
            .find((c) => c.trim().startsWith("redirect="));

          cookie = cookie.split("=")[1];
          console.log(cookie);
        }
      },
      initAuth(vuexContext, req) {
        let token;
        if (req) {
          if (!req.headers.cookie) {
            return;
          }

          token = req.headers.cookie
            .split(";")
            .find((c) => c.trim().startsWith("authKey="));

          if (token) {
            token = token.split("=")[1];
          }
        } else {
          token = localStorage.getItem("authKey");
          if (!token) {
            return;
          }
        }

        vuexContext.commit("setAuthKey", token);
      },
      login(vuexContext, authKey) {
        Cookie.set("authKey", authKey);
        localStorage.setItem("authKey", authKey);
        vuexContext.commit("setAuthKey", authKey);
      },
      logout(vuexContext){
          vuexContext.commit("clearAuthKey")

      }
    },
    getters: {
      isAuthenticated(state) {
        return state.authKey != null;
      },
      getAuthKey(state) {
        return state.authKey;
      },
    },
  });
};

export default createStore;
