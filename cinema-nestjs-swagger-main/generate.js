const { spawn } = require('child_process');

function generateResource(name) {
  return new Promise((resolve) => {
    const child = spawn('npx', ['@nestjs/cli', 'g', 'res', name, '--no-spec'], {
      shell: true,
      stdio: ['pipe', 'inherit', 'inherit']
    });

    setTimeout(() => {
      child.stdin.write('\n'); // REST API
      setTimeout(() => {
        child.stdin.write('y\n'); // Generate CRUD
        child.stdin.end();
      }, 1000);
    }, 1000);

    child.on('exit', () => resolve());
  });
}

async function run() {
  await generateResource('filme');
  await generateResource('sala');
  await generateResource('sessao');
  await generateResource('ingresso');
  await generateResource('combo');
  await generateResource('pedido');
}
run();
