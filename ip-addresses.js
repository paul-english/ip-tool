Session.set("ip_address", "66.228.52.232");
Session.set("subnet_mask", "255.0.0.0");
Session.set("default_mask", true);

// TODO display if subnetting or supernetting
// TODO ip subnet calculator, subnet-calculator.com

String.prototype.pad = function(length) {
    var str = this;
    while (str.length < length) {
        str = '0' + str;
    }
    return str;
};


/**
 * @function
 * 
 * Converts a number to a binary string representation of the number
 * 
 * @param {Number} bits The number of bits to pad your binary number to. Example: 1.toBinary(8) === "00000001"
 */
Number.prototype.toBinary = function(bits) {
    return this.toString(2).pad(bits);
};

if (Meteor.is_client) {

    Template.ip_address.value = function() {
	return Session.get("ip_address");
    };

    Template.first_octet.value = function() {
	return Session.get("ip_address").split(".")[0];
    };
    Template.second_octet.value = function() {
	return Session.get("ip_address").split(".")[1];
    };
    Template.third_octet.value = function() {
	return Session.get("ip_address").split(".")[2];
    };
    Template.fourth_octet.value = function() {
	return Session.get("ip_address").split(".")[3];
    };

    Template.first_binary_octet.value = function() {
	return parseInt(Session.get("ip_address").split(".")[0]).toBinary(8);
    };
    Template.second_binary_octet.value = function() {
	return parseInt(Session.get("ip_address").split(".")[1]).toBinary(8);
    };
    Template.third_binary_octet.value = function() {
	return parseInt(Session.get("ip_address").split(".")[2]).toBinary(8);
    };
    Template.fourth_binary_octet.value = function() {
	return parseInt(Session.get("ip_address").split(".")[3]).toBinary(8);
    };

    Template.form.ip_class = function() {
	var octets = Session.get('ip_address').split('.');
	var first_octet = parseInt(octets[0]);
	if (first_octet >= 0 && first_octet <= 127) {
	    if (Session.get('default_mask')) Session.set("subnet_mask", "255.0.0.0");
	    return "A";
	} else if (first_octet >= 128 && first_octet <= 191) {
	    if (Session.get('default_mask')) Session.set("subnet_mask", "255.255.0.0");
	    return "B";
	} else if (first_octet >= 192 && first_octet <= 223) {
	    if (Session.get('default_mask')) Session.set("subnet_mask", "255.255.255.0");
	    return "C";
	} else if (first_octet >= 224 && first_octet <= 239) {
	    return "D (multicast)";
	} else if (first_octet >= 240 && first_octet <= 255) {
	    return "E (reserved)";
	}
	return "error";
    };

    Template.form.subnet_mask = function() {
	return Session.get('subnet_mask');
    };

    Template.form.cidr_notation = function() {
	var mask = Session.get('subnet_mask');
	var octets = mask.split(".");
	var i = octets.length;
	var bits = 0;
	while(i--) {
	    var octet = octets[i];
	    var binary_octet = parseInt(octet).toString(2);
	    bits += (binary_octet.split(/1/g).length - 1);
	}
	return Session.get('ip_address') + "/" + bits;
    };

    Template.form.default_network = function() {
	var octets = Session.get('ip_address').split('.');
	var first_octet = parseInt(octets[0]);
	if (first_octet >= 0 && first_octet <= 127) {
	    octets[0] = octets[0] & 255;
	    octets[1] = octets[1] & 0;
	    octets[2] = octets[2] & 0;
	    octets[3] = octets[3] & 0;
	    return octets.join('.');
	} else if (first_octet >= 128 && first_octet <= 191) {
	    octets[0] = octets[0] & 255;
	    octets[1] = octets[1] & 255;
	    octets[2] = octets[2] & 0;
	    octets[3] = octets[3] & 0;
	    return octets.join('.');
	} else if (first_octet >= 192 && first_octet <= 223) {
	    octets[0] = octets[0] & 255;
	    octets[1] = octets[1] & 255;
	    octets[2] = octets[2] & 255;
	    octets[3] = octets[3] & 0;
	    return octets.join('.');
	}
	return "";
    };

    Template.form.public_private = function() {
	var octets = Session.get('ip_address').split('.');
	var first_octet = parseInt(octets[0]);
	var second_octet = parseInt(octets[1]);
	if (first_octet == 10) {
	    return "private (24-bit)";
	} else if (first_octet == 172 && second_octet >= 16 && second_octet <= 31){
	    return "private (20-bit)";
	} else if (first_octet == 192 && second_octet == 168) {
	    return "private (16-bit)";
	}
	return "public";
    };

    Template.form.events = {
	"change input#subnet_mask": function(e) {
	    var value = e.target.value;
	    var ip_address = /^(([1-9][0-9]{0,2})|0)\.(([1-9][0-9]{0,2})|0)\.(([1-9][0-9]{0,2})|0)\.(([1-9][0-9]{0,2})|0)$/;
	    if (ip_address.test(value)) {
		Session.set("default_mask", false);
		Session.set("subnet_mask", value);
	    }
	}
    };

    Template.ip_address.events = {
	"change input#ip-address": function(e) {
	    var value = e.target.value;
	    console.log(value);
	    var ip_address = /^(([1-9][0-9]{0,2})|0)\.(([1-9][0-9]{0,2})|0)\.(([1-9][0-9]{0,2})|0)\.(([1-9][0-9]{0,2})|0)$/;
	    if (ip_address.test(value)) {
		Session.set('ip_address', value);
	    }
	}
    };

    Template.first_octet.events = {
	"change input#first-octet": function(e) {
	    var value = e.target.value;
	    var octet = /^(([1-9][0-9]{0,2})|0)$/;
	    console.log(value, octet.test(value));
	    if (octet.test(value)) {
		var octets = Session.get('ip_address').split(".");
		octets[0] = value;
		Session.set('ip_address', octets.join("."));
	    }
	}
    };

    Template.second_octet.events = {
	"change input#second-octet": function(e) {
	    var value = e.target.value;
	    var octet = /^(([1-9][0-9]{0,2})|0)$/;
	    if (octet.test(value)) {
		var octets = Session.get('ip_address').split(".");
		octets[1] = value;
		Session.set('ip_address', octets.join("."));
	    }
	}
    };

    Template.third_octet.events = {
	"change input#third-octet": function(e) {
	    var value = e.target.value;
	    var octet = /^(([1-9][0-9]{0,2})|0)$/;
	    if (octet.test(value)) {
		var octets = Session.get('ip_address').split(".");
		octets[2] = value;
		Session.set('ip_address', octets.join("."));
	    }
	}
    };

    Template.fourth_octet.events = {
	"change input#fourth-octet": function(e) {
	    var value = e.target.value;
	    var octet = /^(([1-9][0-9]{0,2})|0)$/;
	    if (octet.test(value)) {
		var octets = Session.get('ip_address').split(".");
		octets[3] = value;
		Session.set('ip_address', octets.join("."));
	    }
	}
    };

    Template.first_binary_octet.events = {
	"change input": function(e) {
	    var value = parseInt(e.target.value, 2);
	    var octet = /^(([1-9][0-9]{0,2})|0)$/;
	    if (octet.test(value)) {
		var octets = Session.get('ip_address').split(".");
		octets[0] = value;
		Session.set('ip_address', octets.join("."));
	    }
	}
    };

    Template.second_binary_octet.events = {
	"change input": function(e) {
	    var value = parseInt(e.target.value, 2);
	    var octet = /^(([1-9][0-9]{0,2})|0)$/;
	    if (octet.test(value)) {
		var octets = Session.get('ip_address').split(".");
		octets[1] = value;
		Session.set('ip_address', octets.join("."));
	    }
	}
    };

    Template.third_binary_octet.events = {
	"change input": function(e) {
	    var value = parseInt(e.target.value, 2);
	    var octet = /^(([1-9][0-9]{0,2})|0)$/;
	    if (octet.test(value)) {
		var octets = Session.get('ip_address').split(".");
		octets[2] = value;
		Session.set('ip_address', octets.join("."));
	    }
	}
    };

    Template.fourth_binary_octet.events = {
	"change input": function(e) {
	    var value = parseInt(e.target.value, 2);
	    var octet = /^(([1-9][0-9]{0,2})|0)$/;
	    if (octet.test(value)) {
		var octets = Session.get('ip_address').split(".");
		octets[3] = value;
		Session.set('ip_address', octets.join("."));
	    }
	}
    };

}

if (Meteor.is_server) {
    Meteor.startup(function () {
		       // code to run on server at startup
		   });
}