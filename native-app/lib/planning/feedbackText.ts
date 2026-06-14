type Zone = 'red' | 'orange' | 'green';

export function getSliderFeedback(zone: Zone, thresholdRed: number): string {
  if (thresholdRed === 0) {
    return 'je hebt vandaag geen dringende deadlines. Geniet van de ruimte!';
  }
  const hours = Math.ceil(thresholdRed / 60);
  switch (zone) {
    case 'red':
      return `je moet vandaag minimaal ${hours} uur aan huiswerk besteden om je deadlines te halen !`;
    case 'orange':
      return 'je ligt perfect op schema voor je taken.';
    case 'green':
      return 'je werkt nu alvast vooruit. Je bouwt een buffer op voor je taken.';
  }
}
