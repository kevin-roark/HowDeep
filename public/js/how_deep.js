var io = require('socket.io-client');

var socket = io();

socket.on('connect', function() {
  socket.emit('ready');
});

// Listen for the talk event.
socket.on('send_artist_info', function(data) {
    var artist_html = Handlebars.templates['artists'](data);
    $('#game').html(artist_html);
    star.changeArtist(data);
});

function similar_clicked(name) {
  socket.emit('clicked_artist', {artist_name: name});
}

var Artist = Backbone.Model.extend({

  defaults: {
    name: 'chiodos',
    image: 'http://www.altpress.com/images/uploads/news/ChiodosNEW.jpg'
  }

});

var ArtistList = Backbone.Collection.extend({

  model: Artist,

  getOthers: function(artist) {
    return this.filter(function(art) {
      return art.get('name') !== artist.get('name');
    });
  },

  killOthers: function(artist) {
    this.each(function(art){
      if (art.get('name') != artist.get('name'))
        art.view.goAway();
    });
  }

});

var StarArtist = Backbone.Model.extend({

  defaults: {
    name: 'converge',
    image: 'http://www.caughtinthecrossfire.com/uploads/2012/12/converge.jpg',
    listeners: 123456,
    similars: new ArtistList([
      new Artist({name: 'Birds in Row', image: 'http://userserve-ak.last.fm/serve/500/87089569/Birds+in+Row+BirdsInRow.png'}),
      new Artist({name: 'Trap Them', image: 'http://userserve-ak.last.fm/serve/500/59402069/Trap+Them+trap_them_new564x376.jpg'}),
      new Artist({name: 'Botch', image: 'http://userserve-ak.last.fm/serve/500/284539/Botch.jpg'}),
      new Artist({name: 'Gaza', image: 'http://userserve-ak.last.fm/serve/500/77822572/Gaza+200272_10150131443258872_29006.jpg'}),
      new Artist({name: 'Code Orange Kids', image: 'http://userserve-ak.last.fm/serve/500/84580229/Code+Orange+Kids++1.jpg'})
    ])
  },

  transitionArtist: function(artist) {
    this.set({
      name: artist.get('name'),
      image: artist.get('image'),
    });
    this.set({animated: true});
  },

  changeArtist: function(artist) {
    var context = this;
    if (this.get('animated') !== true)
      setTimeout(function() {
        context.changeArtist(artist);
      }, 200);
    else {
      this.set({listeners: artist.star.listeners});
      this.changeSimilars(artist.sim_arts);
      this.set({animated: false});
    }
  },

  changeSimilars: function(new_sims) {
    var sims = this.get('similars');
    sims.reset();
    for (var i=0; i<new_sims.length; i++) {
      var sim_art = new_sims[i];
      var artist = new Artist({
        name: sim_art.name,
        image: sim_art.image
      });
      sims.add(artist);
    }
    this.trigger('new-sims');
  }

});

var Clock = Backbone.Model.extend({

  defaults: {
    clock: new Tock({ })
  },

  start: function(time) {
    this.get('clock').start(time);
  }

});

var star = new StarArtist();
var timer;

var ArtistView = Backbone.View.extend({

  tagName: 'li',

  similarTemplate: Handlebars.templates['similar_artists'],

  events: {
    "click .similar-img": "imageClicked"
  },

  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
  },

  render: function() {
    //this.$el.hide();
    this.$el.html(this.similarTemplate(this.model.toJSON()));

    return this;
  },

  goAway: function() {
    this.$el.animate({top: 100, opacity: 0})
  },

  imageClicked: function() {
    socket.emit('clicked_artist', {artist_name: this.model.get("name")});
    this.parentView.initiateChange(this.model);
  }

});

var StarArtistView = Backbone.View.extend({

  tagName: 'div',

  starTemplate: Handlebars.templates['main_artist'],

  initialize: function() {
    this.similarZone = $('#similar');
    this.setSimilars();

    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'new-sims', this.setSimilars);
  },

  render: function() {
    this.$el.html(this.starTemplate(this.model.toJSON()));
    return this;
  },

  addSimilar: function(artist) {
    var view = new ArtistView({model: artist});
    artist.view = view;
    view.parentView = this;
    this.similarZone.append(view.render().el);
  },

  setSimilars: function() {
    this.similarZone.hide();
    this.similarZone.empty();
    var Similars = this.model.get('similars');
    Similars.each(this.addSimilar, this);
    this.similarZone.fadeIn(1200);
  },

  initiateChange: function(artist) {
    var context = this;
    var similars = this.model.get('similars');
    similars.killOthers(artist);
    this.$('#star-artist').animate({opacity: 0, top: -300}, {duration: 1000});
    artist.view.$el.animate({top: -320}, {duration: 1000});
    artist.view.$('.similar-img').animate({width: 300, height: 300, 'border-radius': 150},
                                          {duration: 1000, complete: function() {
      artist.view.$el.empty();
      context.model.transitionArtist(artist);
    }});
  }

});

var ClockView = Backbone.View.extend({

  render: function() {
    var clock = this.model.get("clock");
    var time = clock.msToTime(clock.lap());
    this.$el.html(time);
    return this;
  }

});

var AppView = Backbone.View.extend({

  el: $("#howdeepapp"),

  events: {

  },

  initialize: function() {
    var app = this;

    this.starZone = $('#star');
    this.clockZone = $('#clock');
    this.endZone = $('#end');

    timer = new Clock({
      clock: new Tock({
        countdown: true,
        interval: 50,
        callback: function() {
          app.updateClock();
        },
        complete: function() {
          app.endGame();
        }
      })
    });
    this.clockView = new ClockView({model: timer});
    timer.get('clock').view = this;
    timer.start(45000);

    this.starView = new StarArtistView({model: star});

    gameIO.socket.on('send_artist_info', function(data) {
      star.changeArtist(data);
    });

    this.render();
  },

  render: function() {
    this.starZone.html(this.starView.render().el);

    return this;
  },

  updateClock: function() {
    this.clockZone.html(this.clockView.render().el);
  },

  endGame: function() {
    this.starView.model.get('similars').each(function(mod){
      mod.view.undelegateEvents();
    });
    this.endZone.html('GAME OVER DOG');
  }

});

var App = new AppView();
