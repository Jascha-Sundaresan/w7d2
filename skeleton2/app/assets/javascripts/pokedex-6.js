Pokedex.Router = Backbone.Router.extend({
  routes: {
    "": "pokemonIndex",
    "pokemon/:id": "pokemonDetail",
    "pokemon/:pokemonId/toys/:toyId": "toyDetail"
  },

  pokemonDetail: function (id, callback) {
    if (!this._pokemonIndex){
      var that = this;
      this.pokemonIndex(function() {
        that.pokemonDetail(id, callback);
      });
    } else {
      var pokemon = this._pokemonIndex.collection.get(id);
      this._pokemonDetail = new Pokedex.Views.PokemonDetail({ model: pokemon });
      $("#pokedex .pokemon-detail").html(this._pokemonDetail.$el);
      this._pokemonDetail.refreshPokemon(callback);
    }
  },

  pokemonIndex: function (callback) {
    this._pokemonIndex = new Pokedex.Views.PokemonIndex();
    this._pokemonIndex.refreshPokemon(callback);
    $("#pokedex .pokemon-list").html(this._pokemonIndex.$el);
    this.pokemonForm();
  },

  toyDetail: function (pokemonId, toyId) {
    if (!this._pokemonDetail){
      var that = this;
      this.pokemonDetail(pokemonId, function() {
        that.toyDetail(pokemonId, toyId);
      });
    } else {
      var toy = this._pokemonDetail.model.toys().get(toyId);
      var toyDetail = new Pokedex.Views.ToyDetail({model: toy});
      $("#pokedex .toy-detail").html(toyDetail.$el);
      toyDetail.render();
    }
  },
  
  pokemonForm: function () {
    var model = new Pokedex.Models.Pokemon();
    var collection = this._pokemonIndex.collection;
    var pokeForm = new Pokedex.Views.PokemonForm({model: model, collection: collection});
    
    $("#pokedex .pokemon-form").html(pokeForm.$el);
    pokeForm.render();
  }
});

$(function () {
  Pokedex.router = new Pokedex.Router();
  Backbone.history.start();
});