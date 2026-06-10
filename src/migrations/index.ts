import * as migration_20260606_163641 from './20260606_163641';
import * as migration_20260608_add_menu_items from './20260608_add_menu_items';
import * as migration_20260608_menu_items_column_meta from './20260608_menu_items_column_meta';
import * as migration_20260608_menu_items_cta from './20260608_menu_items_cta';
import * as migration_20260610_155557 from './20260610_155557';

export const migrations = [
  {
    up: migration_20260606_163641.up,
    down: migration_20260606_163641.down,
    name: '20260606_163641',
  },
  {
    up: migration_20260608_add_menu_items.up,
    down: migration_20260608_add_menu_items.down,
    name: '20260608_add_menu_items',
  },
  {
    up: migration_20260608_menu_items_column_meta.up,
    down: migration_20260608_menu_items_column_meta.down,
    name: '20260608_menu_items_column_meta',
  },
  {
    up: migration_20260608_menu_items_cta.up,
    down: migration_20260608_menu_items_cta.down,
    name: '20260608_menu_items_cta',
  },
  {
    up: migration_20260610_155557.up,
    down: migration_20260610_155557.down,
    name: '20260610_155557'
  },
];
