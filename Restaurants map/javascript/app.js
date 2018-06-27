var map;

var Location = function(data) {
    var self = this;
    self.id = data.id;
    self.title = data.title;
    self.location = data.location;
    self.visible = ko.observable(true);
    self.cuisine = data.Cuisine;

        var largeInfowindow = new google.maps.InfoWindow();
        // Create a marker per location, and put into markers array.
        this.marker = new google.maps.Marker({
            position: data.location,
            title: data.title,
            animation: google.maps.Animation.DROP,
            id: data.id,
            cuisine: data.Cuisine,
            map: map
        });

        // Create an onclick event to open an infowindow at each marker.
        this.marker.addListener('click', function() {
            var self = this;
            self.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function () {
                self.setAnimation(null);
            }, 700);
            populateInfoWindow(this, largeInfowindow);
        });
};

// This function populates the infowindow when the marker is clicked.
function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        var zomatoApiKey = "3512e4e45cf0be289b3fc1972144300e";
        var zomatoUrl = 'https://developers.zomato.com/api/v2.1/restaurant?res_id='+
             marker.id + '&apikey=' + zomatoApiKey;
        $.getJSON(zomatoUrl).done(function(data) {
          var results = data;
          var Url = results.url || 'No Url Provided';
          var street = results.location.address || 'Address Unavailable';
          var city = results.location.city || '';
          var cuisines = results.cuisines || 'Unavailable';
          var img = results.thumb || '';
          var rating = results.user_rating.aggregate_rating || 'Unavailable';

            infowindow.marker = marker;
            infowindow.close();
            infowindow.setContent( '<div align="center">' +
            '<img src="' + img + '" alt="Image">' +'<div><b>'
            + marker.title + "</b></div>" + '<div><a href="' +
            Url +'">' + Url + "</a></div>" + '<div>' + street +
            "</div>" + '<div>' + city + "</div>" +
            '<div>' + "<b>" + "Cuisines:   " + "</b>" +
            cuisines + "</div>" + '<div>' + "<b>" + "Rating: "
            + "</b>" + rating + "</div>" + "</div>");
            infowindow.open(map, marker);
            // The Marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick', function() {
                infowindow.marker = null;
            });

         }).fail(function() {
    alert("Unable to load Zomato data. Sorry For the inconvinience try again later.");
  });
    }
}

function mapLoadError() {
  alert("Google Maps is Unable to load please try again later.");
}

var appViewModel = function() {
    var self = this;

    var locations =  ko.observableArray([
      {
        id: 2800012 ,
        title: 'Pizza Hut',
        location: {lat:  17.726612, lng: 83.305078},
        Cuisine: 'Fast Food'
      },
      {
        id: 2800052,
        title: 'The Square - Hotel Novotel',
        location: {lat: 17.710699, lng: 83.315891},
        Cuisine: 'Continental, North Indian'
      },
      {
        id: 2800418,
        title: 'Kaloreez',
        location: {lat: 17.715328, lng: 83.314992},
        Cuisine: 'Cafe, North Indian, Chinese'
      },
      {
        id: 2800095,
        title: 'Alpha Hotel',
        location: {lat: 17.712187, lng: 83.301736},
        Cuisine: 'North Indian, Biryani'
      },
      {
        id: 2800757,
        title: 'Bake My Wish',
        location: {lat: 17.731364, lng: 83.339137},
        Cuisine: ' Fast Food'
      },
      {
        id: 2800903 ,
        title: 'Mekong - Hotel GreenPark',
        location: {lat: 17.715418, lng: 83.306216},
        Cuisine: 'Chinese, Thai, Burmese, Vietnamese, Tibetan, Japanese'
      },
      {
        id: 2800042,
        title: 'Vista - The Park',
        location: {lat: 17.72109, lng: 83.33688},
        Cuisine: 'American, North Indian, Thai, Continental'
      },
      {
        id: 2800019,
        title: 'Flying Spaghetti Monster',
        location: {lat: 17.721085, lng: 83.314871},
        Cuisine: 'Mexican, Italian'
      },
      {
        id: 18285610,
        title: 'Six Degrees',
        location: {lat: 17.741924, lng: 83.331384},
        Cuisine: 'South Indian, Chinese, Continental, Italian, North Indian'
      },
      {
        id: 2800897,
        title: 'Tea Trails',
        location: {lat: 17.739438, lng: 83.313359},
        Cuisine: 'Fast Food'
      }
    ]);

    self.search = ko.observable('');
    self.searching = ko.observable('');
    self.markers = ko.observableArray();
    //Create a new map
    var myLocality =
    {
        zoom: 13,
        center: {lat: 17.730704, lng: 83.308702},
        mapTypeControl: false
    };

    map = new google.maps.Map(document.getElementById('map'), myLocality);


    for (var i = 0; i < locations().length; i++) {
        var restaurant = new Location(locations()[i]);
        self.markers.push(restaurant);
    }


    // Search Using Both Name and Cuisine

        self.searchboxes = ko.computed(function() {
        return ko.utils.arrayFilter(self.markers(), function(r) {
            var resName = self.search().toLowerCase();
            var cusName = self.searching().toLowerCase();
            var currentItemName = r.title.toLowerCase();
            var currentItemCuisine = r.cuisine.toLowerCase();
            if (resName && cusName) {
                if ((currentItemName.indexOf(resName) >= 0) && (currentItemCuisine.indexOf(cusName) >= 0)) {
                    r.visible(true);
                    if (r.marker) {
                        r.marker.setVisible(true);
                    }
                } else {
                    r.visible(false);
                    if (r.marker) {
                        r.marker.setVisible(false);
                    }
                }
            }

            if (resName && !cusName) {
                if (currentItemName.indexOf(resName) >= 0) {
                    r.visible(true);
                    if (r.marker) {
                        r.marker.setVisible(true);
                    }
                } else {
                    r.visible(false);
                    if (r.marker) {
                        r.marker.setVisible(false);
                    }
                }
            }

            if (cusName && !resName) {
                if (currentItemCuisine.indexOf(cusName) >= 0) {
                    r.visible(true);
                    if (r.marker) {
                        r.marker.setVisible(true);
                    }
                } else {
                    r.visible(false);
                    if (r.marker) {
                        r.marker.setVisible(false);
                    }
                }
            }

            if (!cusName && !resName) {
                r.visible(true);
                    if (r.marker) {
                        r.marker.setVisible(true);
                    }
            }
        });
    });

    self.infoPopup = function (locations) {
        google.maps.event.trigger(locations.marker, 'click');
    };

    self.reCenter = function() {
        map.setCenter(myLocality.center);
    };
};

function initMap() {
  ko.applyBindings(new appViewModel());
}
