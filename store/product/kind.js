export const state = () => ({
  kinds: {
    fetching: false,
    data: []
  },
  kindsParentWithBother: {
    fetching: false,
    data: []
  },
  children: {
    fetching: false,
    data: []
  },
  kindProperty: {
    fetching: false,
    data: []
  },
  brands: {
    fetching: false,
    data: []
  }
})

export const mutations = {
  REQUEST_KIND (state, action) {
    if (!action.id) {
      state.kinds.fetching = true
    } else {
      const kind = state.kinds.data.find(kind => Object.is(kind.id, action.id))
      if (kind) {
        kind.fetching = true
      }
    }
  },
  GET_KIND_FAILURE (state, action) {
    if (!action.id) {
      state.kinds.fetching = false
    } else {
      const kind = state.kinds.data.find(kind => Object.is(kind.id, action.id))
      if (kind) {
        kind.fetching = false
      }
    }
  },
  GET_KIND_SUCCESS (state, action) {
    if (!action.id) {
      state.kinds.fetching = false
      action.result.forEach(kind => {
        kind.fetching = false
      })
      state.kinds.data = action.result
    } else {
      const kind = state.kinds.data.find(kind => Object.is(kind.id, action.id))
      if (kind) {
        kind.fetching = false
        kind.children = action.result
      }
    }
  },
  REQUEST_KINDPARENTSWITHBOTHERS (state) {
    state.kindsParentWithBother.fetching = true
  },
  GET_KINDPARENTSWITHBOTHERS_SUCCESS (state, result) {
    state.kindsParentWithBother.fetching = false
    state.kindsParentWithBother.data = result
  },
  GET_KINDPARENTSWITHBOTHERS_FAILURE (state) {
    state.kindsParentWithBother.fetching = false
  },
  REQUEST_CHILDREN (state) {
    state.children.fetching = true
  },
  GET_CHILDREN_SUCCESS (state, result) {
    state.children.fetching = false
    state.children.data = result
  },
  GET_CHILDREN_FAILURE (state) {
    state.children.fetching = false
  },
  REQUEST_KINDPROPERTY (state) {
    state.kindProperty.fetching = true
  },
  GET_KINDPROPERTY_SUCCESS (state, result) {
    state.kindProperty.fetching = false
    state.kindProperty.data = result
  },
  GET_KINDPROPERTY_FAILURE (state) {
    state.kindProperty.fetching = false
  },
  REQUEST_KINDBRANDS (state) {
    state.brands.fetching = true
  },
  GET_KINDBRANDS_SUCCESS (state, result) {
    state.brands.fetching = false
    state.brands.data = result
  },
  GET_KINDBRANDS_FAILURE (state) {
    state.brands.fetching = false
  }
}
