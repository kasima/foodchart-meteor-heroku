var People, chartBalance, chartIsBalanced, createPerson;

People = new Meteor.Collection("people");

if (Meteor.isClient) {
  chartBalance = function() {
    var balances;
    balances = People.find({}).map(function(p) {
      return p.balance;
    });
    return balances.reduce((function(a, b) {
      return a + b;
    }), 0);
  };
  chartIsBalanced = function() {
    return chartBalance() === 0;
  };
  Template.people.people = function() {
    return People.find({});
  };
  Template.people.chartStatusStyle = function() {
    if (chartIsBalanced()) {
      return 'style="display:none;"';
    } else {
      return 'style="display:block;"';
    }
  };
  Template.person.deleteButtonStyle = function() {
    if ((this.balance === 0) && chartIsBalanced()) {
      return 'style="display:inline-block;"';
    } else {
      return 'style="display:none;"';
    }
  };
  Template.person.events = {
    'click .increment': function(event) {
      return People.update(this._id, {
        $set: {
          balance: this.balance + 1
        }
      });
    },
    'click .decrement': function(event) {
      return People.update(this._id, {
        $set: {
          balance: this.balance - 1
        }
      });
    },
    'click .btn-delete': function(event) {
      return People.remove(this._id);
    }
  };
  createPerson = function(template) {
    var error_el, input_el;
    input_el = template.find('#person-name-input');
    error_el = template.find('#person-name-error');
    if (input_el.value) {
      People.insert({
        name: input_el.value,
        balance: 0
      });
      input_el.value = '';
      return error_el.innerText = '';
    } else {
      error_el.innerText = "can't be blank";
      return $('#person-form-group').addClass('error');
    }
  };
  Template.form.events = {
    'keyup .btn-delete': function(event, template) {
      if (event.type === "keyup" && event.which === 13) {
        createPerson(template);
        return event.preventDefault();
      }
    },
    'click .btn-submit': function(event, template) {
      createPerson(template);
      return event.preventDefault();
    }
  };
}

if (Meteor.isServer) {
  Meteor.startup(function() {});
}
