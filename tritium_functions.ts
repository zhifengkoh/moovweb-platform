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