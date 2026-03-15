import type { QuizQuestion, Challenge } from '@/types';

// ---------------------------------------------------------------------------
// Quiz questions — 3 per module, 27 total
// ---------------------------------------------------------------------------

export const moduleQuizzes: Record<string, QuizQuestion[]> = {
  /* ------------------------------------------------------------------ */
  maxwell: [
    {
      question:
        'Which of Maxwell\'s equations introduces the displacement current term?',
      options: [
        'Gauss\'s law for electricity',
        'Gauss\'s law for magnetism',
        'Faraday\'s law',
        'Ampère–Maxwell law',
      ],
      correctIndex: 3,
      explanation:
        'The Ampère–Maxwell law adds the displacement current ε₀(∂E/∂t) to the original Ampère\'s law, allowing it to account for time-varying electric fields and ensuring consistency with charge conservation.',
      hints: [
        { tier: 1, label: 'Conceptual hint', content: 'Think about which equation was modified to include a new term that accounts for time-varying electric fields.' },
        { tier: 2, label: 'Procedural hint', content: 'The displacement current term ε₀(∂E/∂t) was added to one of the original equations to fix an inconsistency with charge conservation. Which equation relates magnetic fields to currents?' },
        { tier: 3, label: 'Show worked step', content: 'Original Ampère\'s law: ∮B·dl = μ₀I_enc. Maxwell added: ∮B·dl = μ₀I_enc + μ₀ε₀(dΦ_E/dt). The extra term is the displacement current. This is the Ampère–Maxwell law — option D.' },
      ],
    },
    {
      question:
        'What do Maxwell\'s equations collectively predict when combined in free space?',
      options: [
        'Static electric fields only',
        'The existence of electromagnetic waves propagating at speed c',
        'That magnetic monopoles must exist',
        'That electric charge is not conserved',
      ],
      correctIndex: 1,
      explanation:
        'By taking the curl of Faraday\'s law and the Ampère–Maxwell law and combining them, one derives the electromagnetic wave equation, predicting waves that travel at c = 1/√(μ₀ε₀).',
    },
    {
      question:
        'How many of Maxwell\'s equations explicitly contain B or Φ_B?',
      options: [
        'One',
        'Two',
        'Three',
        'Four',
      ],
      correctIndex: 2,
      explanation:
        'Three of Maxwell\'s equations explicitly contain B or Φ_B: Gauss\'s law for magnetism (∮B·dA = 0), Faraday\'s law (∮E·dl = −dΦ_B/dt), and the Ampère–Maxwell law (∮B·dl = μ₀I + μ₀ε₀ dΦ_E/dt). Gauss\'s law for electricity (∮E·dA = Q/ε₀) involves only E and charge — it contains no magnetic field term.',
    },
  ],

  /* ------------------------------------------------------------------ */
  gauss: [
    {
      question:
        'A spherical Gaussian surface encloses a net charge of +Q. If the radius of the surface is doubled, what happens to the total electric flux through it?',
      options: [
        'It quadruples',
        'It doubles',
        'It stays the same',
        'It is halved',
      ],
      correctIndex: 2,
      explanation:
        'Gauss\'s law states Φ_E = Q_enc/ε₀. The total flux depends only on the enclosed charge, not the size or shape of the Gaussian surface. Doubling the radius does not change Q_enc.',
    },
    {
      question:
        'What does Gauss\'s law for magnetism (∮B·dA = 0) imply?',
      options: [
        'Magnetic field lines are always straight',
        'There are no magnetic monopoles; magnetic field lines form closed loops',
        'The magnetic field inside any closed surface is zero',
        'Magnetic flux can be created from nothing',
      ],
      correctIndex: 1,
      explanation:
        'A zero net magnetic flux through every closed surface means magnetic field lines have no beginning or end — they form closed loops. This is equivalent to saying isolated magnetic monopoles do not exist.',
    },
    {
      question:
        'Which Gaussian surface is most useful for finding the electric field of an infinite line charge?',
      options: [
        'A sphere centred on the line',
        'A cube with one face on the line',
        'A coaxial cylinder centred on the line',
        'A flat disk perpendicular to the line',
      ],
      correctIndex: 2,
      explanation:
        'The symmetry of an infinite line charge is cylindrical. A coaxial cylindrical Gaussian surface exploits this symmetry so that E is constant on the curved surface and the flux integral simplifies to E(2πrL) = λL/ε₀.',
    },
  ],

  /* ------------------------------------------------------------------ */
  coulomb: [
    {
      question:
        'Two point charges of +2 μC and −2 μC are separated by 0.1 m. If the separation is doubled to 0.2 m, how does the magnitude of the Coulomb force change?',
      options: [
        'It is halved',
        'It is quartered',
        'It remains the same',
        'It is doubled',
      ],
      correctIndex: 1,
      explanation:
        'Coulomb\'s law F = kq₁q₂/r² follows an inverse-square relationship. Doubling the distance means F_new = F/(2²) = F/4, so the force is reduced to one quarter.',
    },
    {
      question:
        'Three identical positive charges are placed at the vertices of an equilateral triangle. What is the direction of the net force on each charge?',
      options: [
        'Toward the centre of the triangle',
        'Along one side of the triangle',
        'Directly away from the centre of the triangle',
        'Tangent to the circumscribed circle',
      ],
      correctIndex: 2,
      explanation:
        'By the superposition principle, each charge is repelled by the other two. The symmetry of the equilateral triangle ensures the two repulsive force vectors add to give a resultant pointing radially outward from the centre.',
    },
    {
      question:
        'Electric field lines from a positive point charge:',
      options: [
        'Form closed loops around the charge',
        'Point radially inward toward the charge',
        'Point radially outward from the charge',
        'Are parallel straight lines',
      ],
      correctIndex: 2,
      explanation:
        'By convention, electric field lines originate on positive charges and terminate on negative charges. For an isolated positive point charge the field is spherically symmetric and points radially outward.',
    },
  ],

  /* ------------------------------------------------------------------ */
  ampere: [
    {
      question:
        'A long straight wire carries current I. At a perpendicular distance r from the wire, the magnitude of the magnetic field is:',
      options: [
        'B = μ₀I / (4πr²)',
        'B = μ₀I / (2πr)',
        'B = μ₀I / (2r²)',
        'B = μ₀Ir / (2π)',
      ],
      correctIndex: 1,
      explanation:
        'Applying Ampère\'s law with a circular Amperian loop of radius r around the wire gives ∮B·dl = B(2πr) = μ₀I, so B = μ₀I/(2πr).',
    },
    {
      question:
        'When using the right-hand grip rule for a straight current-carrying wire, the thumb points in the direction of:',
      options: [
        'The magnetic field',
        'The electric field',
        'The conventional current',
        'The force on the wire',
      ],
      correctIndex: 2,
      explanation:
        'In the right-hand grip rule, the thumb is aligned with the direction of conventional current flow, and the curled fingers indicate the direction of the circular magnetic field lines around the wire.',
    },
    {
      question:
        'Inside an ideal solenoid of n turns per unit length carrying current I, the magnetic field magnitude is:',
      options: [
        'B = μ₀nI',
        'B = μ₀I / (2πn)',
        'B = μ₀n²I',
        'B = μ₀I / n',
      ],
      correctIndex: 0,
      explanation:
        'Applying Ampère\'s law to a rectangular loop partly inside the solenoid yields B·l = μ₀(nl)I, giving B = μ₀nI. The field is uniform inside and nearly zero outside an ideal solenoid.',
    },
  ],

  /* ------------------------------------------------------------------ */
  lorentz: [
    {
      question:
        'A proton moves with velocity v perpendicular to a uniform magnetic field B. The resulting Lorentz force causes the proton to:',
      options: [
        'Accelerate in a straight line',
        'Decelerate and stop',
        'Move in a circular path',
        'Spiral outward indefinitely',
      ],
      correctIndex: 2,
      explanation:
        'The magnetic force F = qv×B is always perpendicular to the velocity, so it changes the direction but not the speed. This centripetal force results in uniform circular motion with radius r = mv/(qB).',
    },
    {
      question:
        'The cyclotron radius of a charged particle in a magnetic field is r = mv/(qB). If the particle\'s speed is doubled while B remains constant, the radius:',
      options: [
        'Is halved',
        'Stays the same',
        'Is doubled',
        'Is quadrupled',
      ],
      correctIndex: 2,
      explanation:
        'Since r = mv/(qB), the radius is directly proportional to v. Doubling the speed doubles the cyclotron radius while the period of revolution remains the same (for non-relativistic speeds).',
    },
    {
      question:
        'A negative charge moves in the +x direction through a magnetic field pointing in the +z direction. What is the direction of the magnetic force on the charge?',
      options: [
        '+y direction',
        '−y direction',
        '+z direction',
        '−x direction',
      ],
      correctIndex: 0,
      explanation:
        'Using F = qv×B: v×B = x̂×ẑ = −ŷ for the cross-product. For a negative charge, q < 0, so F = q(−ŷ) = +ŷ. The force is in the +y direction.',
    },
  ],

  /* ------------------------------------------------------------------ */
  faraday: [
    {
      question:
        'A coil of 100 turns experiences a change in magnetic flux of 0.05 Wb in 0.1 s. What is the magnitude of the induced EMF?',
      options: [
        '0.5 V',
        '5 V',
        '50 V',
        '500 V',
      ],
      correctIndex: 2,
      explanation:
        'Faraday\'s law gives |EMF| = N|dΦ/dt| = 100 × (0.05/0.1) = 100 × 0.5 = 50 V. The number of turns acts as a multiplicative factor on the rate of flux change.',
    },
    {
      question:
        'Which of the following will NOT induce an EMF in a stationary loop?',
      options: [
        'Increasing the magnetic field through the loop',
        'Rotating the loop in a uniform magnetic field',
        'A constant, uniform magnetic field perpendicular to the loop',
        'Moving a bar magnet toward the loop',
      ],
      correctIndex: 2,
      explanation:
        'Faraday\'s law requires a changing magnetic flux (dΦ/dt ≠ 0) to induce an EMF. A constant, uniform field through a stationary loop of fixed area produces constant flux, so dΦ/dt = 0 and no EMF is induced.',
    },
    {
      question:
        'In Faraday\'s law, EMF = −NdΦ/dt, the negative sign is a mathematical expression of:',
      options: [
        'Coulomb\'s law',
        'Lenz\'s law',
        'Ampère\'s law',
        'Ohm\'s law',
      ],
      correctIndex: 1,
      explanation:
        'The negative sign in Faraday\'s law embodies Lenz\'s law: the induced EMF drives a current whose magnetic field opposes the change in flux that produced it, ensuring energy conservation.',
    },
  ],

  /* ------------------------------------------------------------------ */
  lenz: [
    {
      question:
        'A bar magnet is pushed north-pole-first toward a conducting loop. The induced current in the loop will:',
      options: [
        'Create a magnetic field that attracts the magnet',
        'Create a magnetic field that repels the magnet',
        'Have no magnetic effect',
        'Create an electric field parallel to the magnet\'s axis',
      ],
      correctIndex: 1,
      explanation:
        'Lenz\'s law states that the induced current opposes the change causing it. As the magnet approaches, flux through the loop increases, so the induced current creates a field that repels the incoming magnet, opposing the increase in flux.',
    },
    {
      question:
        'Lenz\'s law is fundamentally a consequence of:',
      options: [
        'Conservation of charge',
        'Conservation of momentum',
        'Conservation of energy',
        'Conservation of angular momentum',
      ],
      correctIndex: 2,
      explanation:
        'If the induced current aided the flux change instead of opposing it, it would amplify the change, creating a runaway process that generates energy from nothing. Lenz\'s law prevents this, enforcing conservation of energy.',
    },
    {
      question:
        'A conducting ring is being pulled out of a region of uniform magnetic field pointing into the page. As the ring exits, the induced current flows:',
      options: [
        'Clockwise, to maintain the flux through the ring',
        'Counter-clockwise, to reduce the flux through the ring',
        'Clockwise, to oppose the decrease in flux through the ring',
        'There is no induced current because the field is uniform',
      ],
      correctIndex: 2,
      explanation:
        'As the ring exits the field region, the flux through it decreases. By Lenz\'s law the induced current must oppose this decrease by producing its own field into the page inside the loop, which requires a clockwise current (by the right-hand rule).',
    },
  ],

  /* ------------------------------------------------------------------ */
  'em-wave': [
    {
      question:
        'In a plane electromagnetic wave propagating in the +z direction, the electric field oscillates in the x direction. In which direction does the magnetic field oscillate?',
      options: [
        '+z direction',
        '−z direction',
        '+y direction',
        '+x direction',
      ],
      correctIndex: 2,
      explanation:
        'In an EM wave, E, B, and the propagation direction k are mutually perpendicular and form a right-handed triad. With E along x and k along z, B must oscillate along the y direction (x̂ × ŷ = ẑ).',
    },
    {
      question:
        'The speed of light in vacuum is given by c = 1/√(μ₀ε₀). If light enters a medium with refractive index n = 1.5, its speed becomes:',
      options: [
        '1.5c',
        'c',
        'c/1.5 ≈ 2 × 10⁸ m/s',
        'c/1.5² ≈ 1.33 × 10⁸ m/s',
      ],
      correctIndex: 2,
      explanation:
        'The speed of light in a medium is v = c/n. For n = 1.5, v = (3 × 10⁸)/1.5 = 2 × 10⁸ m/s. The refractive index quantifies how much slower light travels in the medium compared to vacuum.',
    },
    {
      question:
        'In an AC circuit, voltage and current phasors are represented as rotating vectors. If the current lags the voltage by 90°, the circuit element is:',
      options: [
        'A pure resistor',
        'A pure capacitor',
        'A pure inductor',
        'An open circuit',
      ],
      correctIndex: 2,
      explanation:
        'In a pure inductor, the voltage leads the current by 90° (equivalently, current lags voltage by 90°). This phase relationship arises because the inductor\'s back-EMF is proportional to di/dt, introducing a quarter-cycle delay.',
    },
  ],

  /* ------------------------------------------------------------------ */
  polarization: [
    {
      question:
        'Linearly polarized light can be described as a superposition of two circularly polarized waves of:',
      options: [
        'The same handedness and equal amplitude',
        'Opposite handedness and equal amplitude',
        'Opposite handedness and different amplitudes',
        'The same handedness and different amplitudes',
      ],
      correctIndex: 1,
      explanation:
        'A linearly polarized wave is the sum of a right-circularly polarized (RCP) and a left-circularly polarized (LCP) wave of equal amplitude. The two rotating components add constructively along one axis and cancel along the perpendicular axis.',
    },
    {
      question:
        'Circularly polarized light is produced when two orthogonal linearly polarized components have equal amplitudes and a phase difference of:',
      options: [
        '0°',
        '45°',
        '90°',
        '180°',
      ],
      correctIndex: 2,
      explanation:
        'When two equal-amplitude orthogonal components are 90° (π/2) out of phase, the resultant electric field vector traces a circle. A 0° phase difference gives linear polarization, and 180° gives linear polarization in a rotated direction.',
    },
    {
      question:
        'In the Jones vector formalism, which vector represents right-circularly polarized light?',
      options: [
        '(1/√2) [1, i]ᵀ',
        '(1/√2) [1, −i]ᵀ',
        '[1, 0]ᵀ',
        '[0, 1]ᵀ',
      ],
      correctIndex: 1,
      explanation:
        'Right-circular polarization is represented by the Jones vector (1/√2)[1, −i]ᵀ, where the −i indicates the y-component lags the x-component by 90°. Left-circular polarization uses +i instead. The convention follows the optics standard where the observer faces the incoming wave.',
    },
  ],

  /* ------------------------------------------------------------------ */
  'magnetic-circuits': [
    {
      question:
        'In a magnetic circuit, what is reluctance analogous to in an electric circuit?',
      options: [
        'Voltage',
        'Current',
        'Resistance',
        'Capacitance',
      ],
      correctIndex: 2,
      explanation:
        'Reluctance ℛ = l/(μA) is the magnetic analog of resistance R = l/(σA). Just as resistance opposes current flow, reluctance opposes magnetic flux.',
    },
    {
      question:
        'What happens to the inductance of a toroid when an air gap is introduced?',
      options: [
        'Inductance increases',
        'Inductance decreases',
        'Inductance stays the same',
        'Inductance becomes zero',
      ],
      correctIndex: 1,
      explanation:
        'An air gap has much higher reluctance than iron (μ_air ≪ μ_iron), so total reluctance increases and inductance L = N²/ℛ decreases.',
    },
    {
      question:
        'For an ideal transformer with N₁ = 100 and N₂ = 500 turns, if V₁ = 12 V, what is V₂?',
      options: [
        '2.4 V',
        '12 V',
        '60 V',
        '600 V',
      ],
      correctIndex: 2,
      explanation:
        'For an ideal transformer, V₂/V₁ = N₂/N₁ = 500/100 = 5. Therefore V₂ = 5 × 12 V = 60 V.',
    },
  ],
};

// ---------------------------------------------------------------------------
// Challenges — 1 per module
// ---------------------------------------------------------------------------

export const moduleChallenges: Record<string, Challenge[]> = {
  maxwell: [
    {
      title: 'Unify the Equations',
      description:
        'Explore how Maxwell\'s four equations connect electric and magnetic phenomena by toggling each equation on and off in the interactive display and observing which physical effects disappear.',
      instructions: [
        'Open the Maxwell\'s Equations interactive overview.',
        'Enable all four equations and note the full electromagnetic behaviour shown.',
        'Disable the displacement-current term in the Ampère–Maxwell law and observe what changes.',
        'Re-enable it, then disable Faraday\'s law. Note which coupling between E and B is lost.',
        'Write a short summary explaining why all four equations are needed for electromagnetic wave propagation.',
      ],
      hint: 'Think about which equations couple the time-varying electric and magnetic fields to each other.',
    },
  ],

  gauss: [
    {
      title: 'Flux Through Any Surface',
      description:
        'Use the Gaussian surface tool to verify that the total electric flux through a closed surface depends only on the enclosed charge, regardless of the surface\'s shape or size.',
      instructions: [
        'Place a single positive charge at the centre of the simulation.',
        'Draw a small spherical Gaussian surface around the charge and record the total flux.',
        'Enlarge the sphere to twice the radius and compare the flux value.',
        'Switch the surface shape to a cube and then an irregular blob, each time recording the flux.',
        'Verify that all flux values agree with Φ = Q/ε₀.',
      ],
      hint: 'Gauss\'s law guarantees the answer is the same for every closed surface — only the enclosed charge matters.',
    },
  ],

  coulomb: [
    {
      title: 'Superposition Explorer',
      description:
        'Use the charge-placement tool to build a configuration of three point charges and predict the net electric field at a test point using the superposition principle.',
      instructions: [
        'Place two charges of +1 μC at positions (−0.5, 0) and (0.5, 0) in the simulation.',
        'Predict the direction and relative magnitude of the electric field at the origin.',
        'Add a third charge of −2 μC at (0, 0.5) and predict the new net field at the origin.',
        'Use the field-vector display to verify your predictions.',
        'Adjust charge magnitudes and observe how the field at the origin changes according to the inverse-square law.',
      ],
      hint: 'At the origin the two equal positive charges create equal and opposite horizontal fields that cancel, leaving only the vertical contribution.',
    },
  ],

  ampere: [
    {
      title: 'Map the Magnetic Field',
      description:
        'Use the current-carrying wire simulation to explore how the magnetic field varies with distance and verify the B = μ₀I/(2πr) relationship.',
      instructions: [
        'Set a single straight wire carrying 5 A of current.',
        'Use the field probe to measure B at distances r = 1 cm, 2 cm, 4 cm, and 8 cm from the wire.',
        'Plot your measurements and confirm the 1/r dependence.',
        'Apply the right-hand grip rule to verify the field direction at each measurement point.',
        'Double the current to 10 A and confirm that B doubles at each distance.',
      ],
      hint: 'B should halve each time you double r. Check that your measurements follow this pattern.',
    },
  ],

  lorentz: [
    {
      title: 'Cyclotron Radius Investigation',
      description:
        'Launch charged particles into a uniform magnetic field and measure how the cyclotron radius depends on velocity and field strength.',
      instructions: [
        'Set the magnetic field to 0.1 T pointing out of the screen.',
        'Launch a proton at speed v = 1 × 10⁶ m/s perpendicular to B and measure the circular orbit radius.',
        'Double the speed to 2 × 10⁶ m/s and measure the new radius; confirm it doubles.',
        'Return to the original speed and double B to 0.2 T; confirm the radius halves.',
        'Calculate r = mv/(qB) for each case and compare with your measurements.',
      ],
      hint: 'The cyclotron radius r = mv/(qB) is proportional to v and inversely proportional to B.',
    },
  ],

  faraday: [
    {
      title: 'Induce an EMF',
      description:
        'Use the interactive coil-and-magnet simulation to investigate how the rate of flux change determines the induced EMF.',
      instructions: [
        'Set the coil to 50 turns and move the bar magnet slowly toward it. Record the peak EMF.',
        'Repeat the motion at twice the speed and compare the new peak EMF.',
        'Keep the speed constant but change the coil to 100 turns. Verify the EMF doubles.',
        'Try moving the magnet away instead of toward the coil and observe the sign change.',
        'Explain your observations using EMF = −NdΦ/dt.',
      ],
      hint: 'Faster motion means larger dΦ/dt and therefore larger induced EMF. More turns multiply the effect.',
    },
  ],

  lenz: [
    {
      title: 'Oppose the Change',
      description:
        'Demonstrate Lenz\'s law by observing the direction of induced currents and the resulting magnetic braking effect in the simulation.',
      instructions: [
        'Drop a bar magnet (north pole down) toward a conducting ring and observe the induced current direction.',
        'Verify that the ring\'s induced magnetic field opposes the approaching magnet (repulsion).',
        'Now pull the magnet away and confirm the induced current reverses, attracting the magnet.',
        'Replace the ring with a broken (non-conducting) ring and observe that no braking force occurs.',
        'Explain how Lenz\'s law enforces conservation of energy in each scenario.',
      ],
      hint: 'The induced current always creates a force that opposes the motion causing the flux change — approaching magnets are repelled, departing magnets are attracted.',
    },
  ],

  'em-wave': [
    {
      title: 'Wave Propagation and Phasors',
      description:
        'Explore the relationship between E and B fields in an electromagnetic wave and examine AC phasor behaviour using the simulation controls.',
      instructions: [
        'Set the EM wave frequency to 1 GHz and observe the E and B field oscillations.',
        'Verify that E and B are perpendicular to each other and to the propagation direction.',
        'Increase the refractive index slider from 1.0 to 1.5 and observe the change in wavelength and speed.',
        'Switch to the AC phasor view and set a phase difference between voltage and current. Observe the rotating phasors.',
        'Confirm that the time-averaged power is proportional to cos(φ), where φ is the phase difference.',
      ],
      hint: 'In a medium with refractive index n, the speed is v = c/n and the wavelength shrinks by a factor of n, but the frequency stays the same.',
    },
  ],

  polarization: [
    {
      title: 'Build Every Polarization State',
      description:
        'Use the polarization simulator to construct linear, circular, and elliptical polarization by adjusting the amplitude ratio and phase difference of two orthogonal components.',
      instructions: [
        'Set both orthogonal components to equal amplitude with 0° phase difference and confirm linear polarization at 45°.',
        'Change the phase difference to 90° and observe right-circular polarization.',
        'Change the phase difference to −90° (or 270°) and observe left-circular polarization.',
        'Set unequal amplitudes with a 90° phase difference to produce elliptical polarization.',
        'Identify the Jones vector displayed for each state and verify it matches the theoretical prediction.',
      ],
      hint: 'Equal amplitudes + 90° phase → circle. Unequal amplitudes or any other phase → ellipse. 0° or 180° phase → line.',
    },
  ],

  'magnetic-circuits': [
    {
      title: 'Air-Gap Inductance Explorer',
      description:
        'Investigate how an air gap affects the inductance and flux density of a toroid core.',
      instructions: [
        'Start with an iron core (μᵣ = 5000), N = 200 turns, and I = 1 A with no air gap. Note the inductance L.',
        'Gradually increase the gap from 0% to 5% and observe how L changes.',
        'Switch to ferrite core (μᵣ = 1000) and compare the gap sensitivity.',
        'Predict: at what gap length does L drop to half its no-gap value? Verify with the simulation.',
      ],
      hint: 'Remember: total reluctance ℛ = ℛ_core + ℛ_gap. The gap reluctance ℛ_gap = l_gap/(μ₀A) dominates even for small gaps because μ₀ ≪ μ_core.',
    },
  ],
};
