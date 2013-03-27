# A list of useful Tritium functions that haven't been included in the Tritium standard
# See www.moovweb.com and tritium.io

##################################
# XMLNode.keep_only_attributes() #
##################################
#
# @desc
# -----
# Function to remove all attributes from a node, except the ones that you specify.
# 
# @args
# -----
# @arg Text %input => A string containing the attributes that you want to keep on the current XMLNode 
#
# @usage
# ======
# @html_before
# ------------
# <div class="some_class" id="some_id" data-ur-set="toggler" data-ur-toggler-component="button" data-ur-id="1">
# </div>
#
# @example
# --------
# $("div[@class='some_class']") {
#   keep_only_attributes("data-ur-set, data-ur-toggler-component")
# }
#
# @html_after
# -----------
# <div data-ur-set="toggler" data-ur-toggler-component="button">
# </div>
@func XMLNode.keep_only_attributes(Text %input) {
  %selector = "@*[not(contains('" + %input + "', local-name()))]"
  remove(%selector)
}

####################
# Text.normalize() #
####################
# @desc
# -----
# Normalizes whitespace in a string. Trailing and leading whitespace characters are removed,
# and sequences of more than one whitespace character are normalized to one whitespace character.
#
# @args
# -----
# @arg Text %input => The string you want to normalize
#
# @usage
# ======
# @html_before
# ------------
# <div class=" foo   bar baz  floozie ">
# </div>
#
# @example
# --------
# $("div") {
#   %class = fetch(normalize("@class"))
#   attribute("class", %class)
# }
#
# @html_after
# -----------
# <div class="foo bar baz floozie">
# </div>
@func Text.normalize(Text %input) {
  replace(/\s\s+/, " ")
  replace(/^\s+|\s+$/, "")
}

#######################
# XMLNode.normalize() #
#######################
# @desc
# -----
# Normalizes whitespace in a string. Trailing and leading whitespace characters are removed,
# and sequences of more than one whitespace character are normalized to one whitespace character.
#
# This is the XMLNode variation of normalize().
#
# @args
# -----
# @arg Text %input => The XML Node whose text value you want to normalize
#
# @usage
# ======
# @html_before
# ------------
# <div class=" foo   bar baz  floozie ">
# </div>
#
# @example
# --------
# $("div") {
#   %class = normalize("@class")
#   attribute("class", %class)
# }
#
# @html_after
# -----------
# <div class="foo bar baz floozie">
# </div>
@func XMLNode.normalize(Text %input) {
  %input {
    set(normalize(%input))
  }
}

##########################
# XMLNode.remove_class() #
##########################
# @desc
# -----
# Removes a class from an XMLNode. Also normalizes the resulting class attribute value.
# This function only removes whole classes, i.e. removing "product" as a class name will only
# remove "product", and will not remove "product_thumbnail".
#
# @args
# -----
# @arg Text %input => The class you want to remove
#
# @usage
# ======
# @html_before
# ------------
# <div class=" foo   bar baz  floozie ">
# </div>
#
# @example
# --------
# $("div") {
#   remove_class("foo")
# }
#
# @html_after
# -----------
# <div class="bar baz floozie">
# </div>
@func XMLNode.remove_class(Text %delete_me) {
  %class = fetch("@class")
  %regexp = "\\b" + %delete_me + "\\b"
  %class {
    replace(regexp(%regexp), "")
  }
  %new_class = normalize(%class)
  attribute("class", %new_class)
}

########################################
# XMLNode.yield_to_preceding_sibling() #
########################################
# @desc
# -----
# While iterating over a set of %search_nodes, this function helps you
# target the closest preceding %target_node, and then yields to a Tritium block.
#
# For example, this can be used to perform operations such as removing all 
# occurences of a node type that only appear before a
# second type of node (identified by some other characteristic, such as an attribute or
# the presence of specific child nodes).
#
# See an example: http://play.tritium.io/56a9fabea91293bbb56a3e194efabd83c409f1cd
#
# @args
# -----
# @arg Text %search_node => The node that indicates the presence of the %target_node
# @arg Text %target_node => The node that you want to perform Tritium operations on
#
# @usage
# ======
# @html_before
# ------------
# <ul>
#   <li></li>
#   <li></li>
#   <li class="sublist"></li>
#   <li></li>
#   <li></li>
#   <li></li>
#   <li class="sublist"></li>
#   <li></li>
#   <li></li>
#   <li class="sublist"></li>
#   <li></li>
# </ul>
#
# @example
# --------
# $("ul") {
#   yield_to_preceding_sibling("li[@class='sublist']", "li[not(@class='sublist')]") {
#     remove()
#   }
# }
#
# @html_after
# -----------
# <ul>
#   <li></li>
#   <li class="sublist"></li>
#   <li></li>
#   <li></li>
#   <li class="sublist"></li>
#   <li></li>
#   <li class="sublist"></li>
#   <li></li>
# </ul>
@func XMLNode.yield_to_preceding_sibling(Text %search_node, Text %target_node) {
  $(%search_node) {
    $("preceding-sibling::" + %target_node) {
      yield()
    }
  }
}

################################
# XMLNode.yield_if_not_blank() #
################################
# !HELPER
#
# @desc
# -----
# A control function that yields to any nested Tritium code if the argument string is not empty.
#
# @args
# -----
# @arg Text %str => the string to test for non-emptiness
@func XMLNode.yield_if_not_blank(Text %str) {
  match(%str) {
    with(/^.+$/) {
      yield()
    }
  }
}

############################
# XMLNode.yield_if_blank() #
############################
# !HELPER
#
# @desc
# -----
# A control function that yields to any nested Tritium code if the argument string IS empty.
#
# @args
# -----
# @arg Text %str => the string to test for emptiness
@func XMLNode.yield_if_blank(Text %str) {
  match(%str) {
    with("") {
      yield()
    }
  }
}

#############################
# XMLNode.xpath_from_body() #
#############################
# !HELPER
#
# @desc
# -----
# Constructs an XPath expression with /html/body as the root
#
# @args
# -----
# @arg Text %path => the relative XPath expression
@func XMLNode.xpath_from_body(Text %path) {
  %rel_path = %path
  %rel_path {
    %regex = "^[\\.]?[\\/]?[\\/]?"
    replace(regexp(%regex), "")    
  }
  %abs_path = "/html/body//" + %rel_path
}

############################
# XMLNode.get_image_path() #
############################
# !HELPER
#
# @desc
# -----
# Generates a file path to the default /images directory
#
# @args
# -----
# @arg Text %filename => the relative path, including file name, of an image file under the images directory, e.g. "icons/menu.png"
#
# @return => the full relative path for use with the assets() function
# 
# @usage
# ======
# @example
# --------
# assets(get_image_path('icons/menu.png')) # => assets("images/icons/menu.png")
@func XMLNode.get_image_path(Text %filename) {
  %image_path = "images/" + %filename
}

##############################
# XMLNode.strip_non-digits() #
##############################
# !HELPER
#
# @desc
# -----
# Removes all non-digit characters from a string.
#
# @args
# -----
# @arg Text %str => the string to remove all non-digit characters from
#
# @return => the new string without any non-digits
# 
# @usage
# ======
# @example
# --------
# strip_non_digits(" (19 items)") # => "19"
@func XMLNode.strip_non_digits(Text %str) {
  %new_str = %str
  %new_str {
    replace(/\D/, "")
  }
  %new_str
}