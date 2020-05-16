import { Rule, SchematicContext, Tree, SchematicsException } from '@angular-devkit/schematics';
import { dasherize } from '@angular-devkit/core/src/utils/strings';
import { normalize } from 'path';


// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function htmlToMdEntry(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    // we do this to make sure we're at an Angular app
    const angularConfig = tree.read('./angular.json');
    if (!angularConfig) {
      throw new SchematicsException(`This is not an Angular App. Stopping execution.`);
    }
    // This path is configurable, so make sure it matches 
    // the one in your scully config
    // This is the default
    const staticPath = './dist/static/';
    // This is the path of generation of the routes
    // as defined in the configuration 
    // for entries generated from an API endpoint
    const hasEntries = tree.getDir(normalize(`${staticPath}${_options.path}`));
    // This is where the blog entries markdown files are stored
    // also configurable, make sure it matches your scully config definition
    const blogPath = './blog';
    // get the blogDir, where you will be creating the markdown later
    const blogDir = tree.getDir(blogPath);

    // check that scully has been run and you have a static folder.
    if (!hasEntries && !blogDir) {
      throw new SchematicsException(`Statics files for entries have not been generated. Run 'npm run scully -- --scanRoutes'`);
    }
    // create a markdown file for every route generated from the API endpoint
    const entries = hasEntries.subdirs;
    entries.map((entry) => {
      let title = entry;
      let path =  dasherize(entry);
      tree.create(normalize(`${blogPath}/${path}.md`), `--- \ntitle: ${title} \ndescription:  \npublished: true \nslug: \n--- \n\n\n# ${title}`); 
    })
    // just so you see what are the contents in console. You can remove this
    console.log(hasEntries.subdirs);
    return tree;
  };
}
