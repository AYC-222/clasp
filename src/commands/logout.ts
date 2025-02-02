import {Conf} from '../conf';
import {DOTFILE} from '../dotfile';
import {hasOauthClientSettings} from '../utils';

const {auth} = Conf.get();

/**
 * Logs out the user by deleting credentials.
 */
export default async (): Promise<void> => {
  let previousPath: string | undefined;

  if (hasOauthClientSettings(true)) {
    if (auth.isDefault()) {
      // if no local auth defined, try current directory
      previousPath = auth.path;
      auth.path = '.';
    }

    await DOTFILE.AUTH().delete();

    if (previousPath) {
      auth.path = previousPath;
    }
  }

  if (hasOauthClientSettings()) {
    if (!auth.isDefault()) {
      // if local auth defined, try with default (global)
      previousPath = auth.path;
      auth.path = '';
    }

    await DOTFILE.AUTH().delete();

    if (previousPath) {
      auth.path = previousPath;
    }
  }
};
