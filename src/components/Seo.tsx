import { useEffect } from 'react';
import { applySeo, type SeoProps } from '../utils/seo';

/** Sets document head meta for the current route. */
export function Seo(props: SeoProps) {
  useEffect(() => {
    applySeo(props);
  }, [props.title, props.description, props.path, props.image, props.type, props.noIndex, JSON.stringify(props.jsonLd)]);

  return null;
}
