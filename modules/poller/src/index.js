const job = () => {
  console.log('Running job @ ' + new Date());

  if (Math.random() < 0.5) {
    throw Error('Job failed');
  }
}

job();