Pokedex.Views = {};

Pokedex.Views.PokemonIndex = Backbone.View.extend({
  events: {
    "click li": "selectPokemonFromList"
  },

  initialize: function () {
    this.collection = new Pokedex.Collections.Pokemon();
  },

  addPokemonToList: function (pokemon) {
    var content = JST['pokemonListItem']({pokemon: pokemon});
    this.$el.append(content);
  },

  refreshPokemon: function (options) {
    var that = this;
    this.collection.fetch({
      success: function (){
        that.render();
        if (options) {
          options();
        }
      }
    });
  },

  render: function () {
    var that = this;
    this.$el.empty();
    // this.collection.each(this.addPokemonToList.bind(this));
    this.collection.each(function(poke){
      that.addPokemonToList(poke);
    });
  },

  selectPokemonFromList: function (event) {
    var $currentTarget = $(event.currentTarget);
    var pokeId = $currentTarget.data('id');
    var urlString = "/pokemon/" + pokeId;
    Backbone.history.navigate(urlString, { trigger: true })
  }
});

Pokedex.Views.PokemonDetail = Backbone.View.extend({
  events: {
    "click .toys li" : "selectToyFromList"
  },

  refreshPokemon: function (options) {
    var that = this;
    this.model.fetch({
      success: function(){
        that.render();
        if (options) {
          options();
        }
      }
    });
  },

  render: function () {
    var that = this;
    var content = JST['pokemonDetail']({ pokemon: this.model });
    this.$el.html(content);
    this.model.toys().each(function(toy){
      var content = JST['toyListItem']({ toy: toy });
      that.$el.find(".toys").append(content);
    })
  },

  selectToyFromList: function (event) {
    var $currentTarget = $(event.currentTarget);
    var toyId = $currentTarget.data("id");
    var pokeId = $currentTarget.data("pokemon-id");
    var urlString = "/pokemon/" + pokeId + "/toys/" + toyId;
    Backbone.history.navigate(urlString, { trigger: true }) 
  }
});

Pokedex.Views.ToyDetail = Backbone.View.extend({
  events: {
    "change select": "reassignToy"
  },
  
  render: function () {
    // var newCollection = new Pokedex.Collections.Pokemon();
    var collection = Pokedex.router._pokemonIndex.collection;
    var content = JST['toyDetail']({toy: this.model, pokes: collection});
    this.$el.html(content);
  },
  
  reassignToy: function (event) {
    var $currentTarget = $(event.currentTarget);
    var collection = Pokedex.router._pokemonIndex.collection;  
    var pokemon = collection.get($currentTarget.data("pokemon-id"));
    var toy = pokemon.toys().get($currentTarget.data("toy-id"));

    toy.set("pokemon_id", $currentTarget.val());
    toy.save({}, {
      success: (function () {
        pokemon.toys().remove(toy);
        var urlString = "/pokemon/" + pokemon.get("id")
        this.$el.empty();
        Backbone.history.navigate(urlString, { trigger: true })
      }).bind(this)
    });
  }
});

Pokedex.Views.PokemonForm = Backbone.View.extend({
  events: {
    "submit": "savePokemon"
  },
  
  render: function() {
    var content = JST['pokemonForm']({ pokemon: this.model, collection: this.collection });
    this.$el.html(content);
  },
  
  savePokemon: function (event) {
    event.preventDefault();
    var pokeAttrs = ($(event.target).serializeJSON())['pokemon'];
    var pokemon = new Pokedex.Models.Pokemon(pokeAttrs);
    
    pokemon.save(pokeAttrs, {
      success: (function() {
        this.collection.add(pokemon);
        var urlString = "/pokemon/" + pokemon.get("id");
        Pokedex.router._pokemonIndex.addPokemonToList(pokemon);
        Backbone.history.navigate(urlString, { trigger: true });
      }).bind(this)
    });
  },
});
