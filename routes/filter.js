/**
 * Created by karthikvasudevan on 10/08/15.
 */


var recipe = require('../Recipe/recipe');

exports.index = function(req, res, next)
{
    var query = req.query.q;
    var cookingTime = req.query.cookingTime;
    var starOnly = req.query.toggleStar;
    req.built.recipe = [];
    var recipeIds = [];

    //filtered of starred and with everything else
    if(starOnly == 1) {
        recipe.getStaredByUserIdOnly(req.session.user.id, function(starRows){

            if(starRows.length > 0)
            {
                for(var starRowId in starRows)
                {
                    if(starRows.hasOwnProperty(starRowId))
                    {
                        recipeIds.push(starRows[starRowId].recipeId);
                    }
                }
                recipe.getRecipesWithFilter(query, cookingTime, recipeIds, function (rows) {
                    if (rows !== null) {
                        if (rows.length > 0) {
                            var recipeIng = {};
                            var i = 0;
                            //first make 3 main comma separated ingredients
                            for (var rowId in rows) {
                                if (rows.hasOwnProperty(rowId)) {
                                    if (recipeIng[rows[rowId].recipeId] === undefined) {
                                        recipeIng[rows[rowId].recipeId] = {};
                                        recipeIng[rows[rowId].recipeId].ingredients = '';
                                        i = 0;
                                    }
                                    if (i < 3) {

                                        recipeIng[rows[rowId].recipeId].ingredients += rows[rowId].ingredientName + ", ";
                                        i++;
                                    }
                                }
                            }
                            //then attach ingredients to the rest of the recipe information and fabricate json using req.built
                            var recipex = {};
                            for (var rowId in rows) {
                                if (rows.hasOwnProperty(rowId)) {
                                    if (recipex[rows[rowId].recipeId] === undefined) {
                                        recipex[rows[rowId].recipeId] = {};
                                        var ingredientString = recipeIng[rows[rowId].recipeId].ingredients;
                                        req.built.recipe.push({
                                            "id": rows[rowId].recipeId,
                                            "name": rows[rowId].recipeName,
                                            "url": rows[rowId].recipeName.toLowerCase().replace(" ", "-"),
                                            "cookingTime": rows[rowId].cookingTime,
                                            "mainIngredients": ingredientString.slice(0, ingredientString.length - 2)
                                        });
                                    }

                                }
                            }
                            //sent it to Helper.fabricate
                            next();
                        }
                        else {
                            //report error if no recipes found for the given filter combination
                            req.built.error = {
                                "title": "No Recipe Found",
                                "desc": "Sorry, nothing matched your filter term"
                            };
                            //sent it to Helper.fabricate
                            next();
                        }
                    }
                    else {
                        //this will reset to original list without any filter
                        //sent it to Helper.fabricate
                        next();
                    }
                }, req.messageInstance);
            }
            else
            {
                //report error if no recipes found for the given filter combination
                req.built.error = {
                    "title": "No Recipe Found",
                    "desc": "Sorry, nothing matched your filter term"
                };
                //sent it to Helper.fabricate
                next();
            }

        }, req.messageInstance);

    }
    //filtered everything else but starred
    else
    {
        //recipes with filtered result
        recipe.getRecipesWithFilter(query, cookingTime, recipeIds, function (rows) {
            if (rows !== null) {
                if (rows.length > 0) {
                    var recipeIng = {};
                    var i = 0;
                    //first make 3 main comma separated ingredients
                    for (var rowId in rows) {
                        if (rows.hasOwnProperty(rowId)) {
                            if (recipeIng[rows[rowId].recipeId] === undefined) {
                                recipeIng[rows[rowId].recipeId] = {};
                                recipeIng[rows[rowId].recipeId].ingredients = '';
                                i = 0;
                            }
                            if (i < 3) {

                                recipeIng[rows[rowId].recipeId].ingredients += rows[rowId].ingredientName + ", ";
                                i++;
                            }
                        }
                    }
                    //then attach ingredients to the rest of the recipe information and fabricate json using req.built
                    var recipex = {};
                    for (var rowId in rows) {
                        if (rows.hasOwnProperty(rowId)) {
                            if (recipex[rows[rowId].recipeId] === undefined) {
                                recipex[rows[rowId].recipeId] = {};
                                var ingredientString = recipeIng[rows[rowId].recipeId].ingredients;
                                req.built.recipe.push({
                                    "id": rows[rowId].recipeId,
                                    "name": rows[rowId].recipeName,
                                    "url": rows[rowId].recipeName.toLowerCase().replace(" ", "-"),
                                    "cookingTime": rows[rowId].cookingTime,
                                    "mainIngredients": ingredientString.slice(0, ingredientString.length - 2)
                                });
                            }

                        }
                    }
                    //sent it to Helper.fabricate
                    next();
                }
                else {
                    //report error if no recipes found for the given filter combination
                    req.built.error = {
                        "title": "No Recipe Found",
                        "desc": "Sorry, nothing matched your filter term"
                    };
                    //sent it to Helper.fabricate
                    next();
                }
            }
            else {
                //this will reset to original list without any filter
                //sent it to Helper.fabricate
                next();
            }
        }, req.messageInstance);
    }

};
