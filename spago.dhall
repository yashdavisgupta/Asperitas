{-
Welcome to a Spago project!
You can edit this file as you like.
-}
{ name = "Asperitas"
, dependencies = [ "console", "effect", "psci-support" ]
, packages = ./packages.dhall
, sources = [ "lib/**/*.purs", "test/**/*.purs" ]
}
