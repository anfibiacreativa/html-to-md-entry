import { Rule, SchematicContext, Tree, SchematicsException } from '@angular-devkit/schematics';
import { dasherize } from '@angular-devkit/core/src/utils/strings';
import { normalize } from 'path';


// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function htmlToMdEntry(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const angularConfig = tree.read('./angular.json');
    if (!angularConfig) {
      return;
    }
    const staticPath = './dist/static/';
    const hasEntries = tree.getDir(normalize(`${staticPath}${_options.path}`));
    const blogPath = './blog';
    const blogDir = tree.getDir(blogPath);

    if (!hasEntries && !blogDir) {
      throw new SchematicsException(`Statics files for entries have not been generated. Run 'npm run scully -- --scanRoutes'`);
    }
    const entries = hasEntries.subdirs;
    entries.map((entry) => {
      let title = entry;
      let path =  dasherize(entry)
      tree.create(normalize(`${blogPath}/${path}.md`), `--- \ntitle: ${title} \ndescription:  \npublished: true \nslug: \n--- \n\n\n# ${title}`); 
    })
    console.log(hasEntries.subdirs);
    return tree;
  };
}
