import React, { useState, useRef } from 'react';
import {
    Container,
    Grid,
    Card,
    CardContent,
    CardActions,
    Box,
    Stepper,
    Step,
    StepLabel,
    TextField,
    MenuItem,
    Paper,
    List,
    ListItem,
    ListItemText,
    Divider,
    Chip,
    Avatar,
    useTheme,
    CardHeader,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Button,
    Typography,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tooltip
} from '@mui/material';
import {
    PregnantWoman as PregnantWomanIcon,
    ChildCare as ChildCareIcon,
    ExpandMore as ExpandMoreIcon,
    LocalDining as NutritionIcon,
    Favorite as HealthIcon,
    Spa as SelfCareIcon,
    Print as PrintIcon,
    Close as CloseIcon,
    CalendarToday as CalendarIcon,
    Check as CheckIcon
} from '@mui/icons-material';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import html2canvas from 'html2canvas';

// Register ChartJS components
ChartJS.register(ArcElement, ChartTooltip, Legend, CategoryScale, LinearScale, BarElement);

// Custom theme colors


const Preg = () => {
    const theme = useTheme();
    const [activeStep, setActiveStep] = useState(0);
    const [activeMode, setActiveMode] = useState(null);
    const [formData, setFormData] = useState({
        mode: 'pregnancy',
        currentWeek: 1,
        dietaryPreference: 'vegetarian',
        healthConditions: [],
        weeksSinceDelivery: 1,
        deliveryType: 'Normal',
        breastfeedingStatus: 'Yes'
    });
    const [dashboardData, setDashboardData] = useState(null);
    const [openPrintDialog, setOpenPrintDialog] = useState(false);
    const dashboardRef = useRef();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSubmit = () => {
        if (formData.mode === 'pregnancy') {
            setDashboardData(generatePregnancyData(formData));
        } else {
            setDashboardData(generatePostpartumData(formData));
        }
        setActiveMode(formData.mode);
    };

    const generatePregnancyData = (data) => {
        const tips = getPregnancyTips(data.currentWeek);
        const dietPlan = generatePregnancyDietPlan(data.currentWeek, data.dietaryPreference, data.healthConditions);

        return {
            type: 'pregnancy',
            details: {
                currentWeek: data.currentWeek,
                dietaryPreference: data.dietaryPreference,
                healthConditions: data.healthConditions
            },
            tips,
            dietPlan,
            milestones: getPregnancyMilestones(data.currentWeek),
            weeklyChecklist: getWeeklyChecklist(data.currentWeek)
        };
    };

    const generatePostpartumData = (data) => {
        const tips = getPostpartumTips(data.weeksSinceDelivery, data.deliveryType);
        const nutritionPlan = generatePostpartumNutritionPlan(data.weeksSinceDelivery, data.breastfeedingStatus);

        return {
            type: 'postpartum',
            details: {
                weeksSinceDelivery: data.weeksSinceDelivery,
                deliveryType: data.deliveryType,
                breastfeedingStatus: data.breastfeedingStatus
            },
            tips,
            nutritionPlan,
            recoveryChecklist: getRecoveryChecklist(data.weeksSinceDelivery, data.deliveryType)
        };
    };

    const getPregnancyTips = (week) => {
        const tipsByWeek = {
            1: "Start taking prenatal vitamins with folic acid to support early neural tube development.",
            8: "Your baby is now the size of a raspberry! Morning sickness may peak this week - try small, frequent meals.",
            12: "Congratulations on completing the first trimester! Risk of miscarriage decreases significantly.",
            20: "Halfway there! Your baby can now hear your voice - consider talking or singing to your bump.",
            28: "Third trimester begins. Watch for signs of preeclampsia (swelling, headaches, vision changes).",
            36: "Baby is getting into position for birth. Practice breathing exercises and consider packing your hospital bag."
        };
        return tipsByWeek[week] || `Week ${week}: Stay hydrated, get plenty of rest, and listen to your body's needs.`;
    };

    const getPregnancyMilestones = (week) => {
        const milestones = [
            { week: 8, text: "First ultrasound", completed: week >= 8 },
            { week: 12, text: "Genetic screening", completed: week >= 12 },
            { week: 20, text: "Anatomy scan", completed: week >= 20 },
            { week: 28, text: "Glucose test", completed: week >= 28 },
            { week: 36, text: "Group B strep test", completed: week >= 36 }
        ];
        return milestones.filter(m => m.week <= week + 2);
    };

    const getWeeklyChecklist = (week) => {
        return [
            "Take prenatal vitamins",
            "Drink 8-10 glasses of water",
            "30 minutes of light exercise",
            week >= 20 ? "Do kick counts daily" : "Practice deep breathing",
            "Get 7-9 hours of sleep"
        ];
    };

    const generatePregnancyDietPlan = (week, dietaryPreference, healthConditions = []) => {
        let plan = {
            proteins: [],
            vegetables: [],
            fruits: [],
            grains: [],
            dairy: [],
            specialRecommendations: []
        };

        // Base recommendations
        plan.proteins.push("Lentils", "Beans", "Tofu");
        plan.vegetables.push("Spinach", "Broccoli", "Carrots");
        plan.fruits.push("Bananas", "Apples", "Oranges");
        plan.grains.push("Whole wheat bread", "Brown rice", "Oats");
        plan.dairy.push("Milk", "Yogurt", "Cheese");

        // Adjust based on dietary preference
        if (dietaryPreference === 'non-vegetarian') {
            plan.proteins.push("Chicken", "Salmon", "Eggs");
        } else if (dietaryPreference === 'vegan') {
            plan.dairy = ["Almond milk", "Soy yogurt", "Cashew cheese"];
        }

        // Week-specific recommendations
        if (week >= 20) {
            plan.specialRecommendations.push("Increase iron intake to 27mg daily for baby's growth");
            plan.vegetables.push("Kale", "Beets");
            plan.proteins.push("Lean red meat", "Fortified cereals");
        }

        if (week >= 28) {
            plan.specialRecommendations.push("Increase calcium to 1000mg daily for baby's bone development");
        }

        // Health condition adjustments
        if (healthConditions.includes('Anemia')) {
            plan.specialRecommendations.push("Pair iron-rich foods with vitamin C for better absorption");
            plan.fruits.push("Oranges", "Strawberries", "Kiwi");
        }

        if (healthConditions.includes('Diabetes')) {
            plan.specialRecommendations.push("Monitor carbohydrate intake and choose complex carbs");
            plan.grains = ["Quinoa", "Whole wheat pasta", "Brown rice"];
        }

        return plan;
    };

    const getPostpartumTips = (week, deliveryType) => {
        const tips = {
            1: `Focus on rest and recovery. ${deliveryType === 'C-Section' ? 'Care for your incision and avoid lifting anything heavier than your baby.' : 'Use peri bottles and ice packs for comfort.'}`,
            2: "Continue to prioritize rest. Pelvic floor exercises can help with recovery - start gently.",
            6: deliveryType === 'C-Section'
                ? "Incision should be healing well. Continue to avoid heavy lifting and strenuous activity."
                : "You may begin gentle exercises if comfortable. Listen to your body.",
            12: "Energy levels should be improving. Establish a routine but don't overdo it - recovery takes time."
        };
        return tips[week] || `Week ${week}: Continue with self-care, proper nutrition, and gradual activity increases.`;
    };

    const getRecoveryChecklist = (week, deliveryType) => {
        const baseItems = [
            "Stay hydrated (8-10 glasses water)",
            "Take prescribed vitamins",
            "Practice deep breathing",
            "Monitor incision (if applicable)"
        ];

        if (week >= 2) baseItems.push("Begin gentle pelvic exercises");
        if (week >= 6 && deliveryType === 'Normal') baseItems.push("Start light walking");
        if (week >= 12) baseItems.push("Consider postpartum checkup");

        return baseItems;
    };

    const generatePostpartumNutritionPlan = (week, breastfeedingStatus) => {
        let plan = {
            proteins: [],
            vegetables: [],
            fruits: [],
            grains: [],
            dairy: [],
            hydration: ["At least 8-10 glasses of water daily"],
            specialRecommendations: []
        };

        // Base recommendations
        plan.proteins.push("Eggs", "Lentils", "Chicken");
        plan.vegetables.push("Leafy greens", "Carrots", "Sweet potatoes");
        plan.fruits.push("Bananas", "Apples", "Berries");
        plan.grains.push("Oatmeal", "Whole grain bread", "Quinoa");
        plan.dairy.push("Yogurt", "Milk", "Cheese");

        // Breastfeeding adjustments
        if (breastfeedingStatus !== 'No') {
            plan.specialRecommendations.push("Increase calorie intake by 300-500 calories daily for milk production");
            plan.hydration.push("Drink to thirst - aim for at least 10-12 glasses fluid daily");
            plan.proteins.push("Salmon", "Nuts", "Seeds");
            plan.grains.push("Oats", "Flaxseed");
        }

        // Recovery-specific
        if (week <= 2) {
            plan.specialRecommendations.push("Focus on iron-rich foods to replenish blood loss: red meat, spinach, lentils");
            plan.specialRecommendations.push("Include vitamin C with iron meals for better absorption");
        }

        if (week >= 6) {
            plan.specialRecommendations.push("Gradually return to balanced diet with variety of nutrients");
        }

        return plan;
    };

    const generatePrint = async () => {
        try {
            const input = dashboardRef.current;
            const canvas = await html2canvas(input, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                removeContainer: true,
                logging: false,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${dashboardData.type === 'pregnancy' ? 'Pregnancy Care Plan' : 'Postpartum Recovery Plan'}</title>
            <style>
              body { margin: 0; padding: 0; }
              img { max-width: 100%; height: auto; }
              @page { size: auto; margin: 0mm; }
              @media print {
                body { -webkit-print-color-adjust: exact; }
              }
            </style>
          </head>
          <body>
            <img src="${imgData}" onload="window.print();window.close()" />
          </body>
        </html>
      `);
            printWindow.document.close();
            setOpenPrintDialog(false);
        } catch (error) {
            console.error('Error generating print:', error);
            alert('Failed to generate print. Please try again.');
        }
    };

    const renderHome = () => (
        <Container maxWidth="lg" sx={{ py: 8 }}>
            <Box textAlign="center" mb={8}>
                <Typography variant="h2"
                    sx={{
                        fontWeight: 700,
                        color: 'text.primary',
                        mb: 2,
                        fontSize: { xs: '2.5rem', md: '3.5rem' }
                    }}
                >
                    Pregnancy & Postpartum Care
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto' }}>
                    Get personalized guidance and support throughout your journey to motherhood
                </Typography>
            </Box>

            <Grid container spacing={4}>
                {/* Pregnancy Card */}
                <Grid item xs={12} md={6}>
                    <Card sx={{
                        height: '100%',
                        borderRadius: 4,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 8px 25px rgba(0,0,0,0.12)'
                        }
                    }}>
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{
                                width: 80,
                                height: 80,
                                borderRadius: '20px',
                                bgcolor: 'success.light',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 3
                            }}>
                                <PregnantWomanIcon sx={{ fontSize: 40, color: 'success.main' }} />
                            </Box>
                            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                                Pregnancy Care
                            </Typography>
                            <Typography sx={{ mb: 4, color: 'text.secondary' }}>
                                Comprehensive week-by-week guidance for a healthy pregnancy journey
                            </Typography>
                            <Box sx={{ mb: 4 }}>
                                {['Weekly Development Updates', 'Personalized Nutrition Plans', 'Health Monitoring', 'Expert Tips & Advice'].map((feature) => (
                                    <Box key={feature} sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        mb: 2,
                                        color: 'text.secondary'
                                    }}>
                                        <Box sx={{
                                            width: 24,
                                            height: 24,
                                            borderRadius: '50%',
                                            bgcolor: 'success.light',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mr: 2
                                        }}>
                                            <CheckIcon sx={{ fontSize: 16, color: 'success.main' }} />
                                        </Box>
                                        {feature}
                                    </Box>
                                ))}
                            </Box>
                            <Button
                                variant="contained"
                                color="success"
                                size="large"
                                fullWidth
                                onClick={() => {
                                    setActiveMode('pregnancy');
                                    setFormData(prev => ({ ...prev, mode: 'pregnancy' }));
                                }}
                                sx={{
                                    py: 1.5,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontSize: '1.1rem'
                                }}
                            >
                                Start Your Pregnancy Journey
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Postpartum Card - Similar structure with different colors */}
                <Grid item xs={12} md={6}>
                    <Card sx={{
                        height: '100%',
                        borderRadius: 4,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 8px 25px rgba(0,0,0,0.12)'
                        }
                    }}>
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{
                                width: 80,
                                height: 80,
                                borderRadius: '20px',
                                bgcolor: 'secondary.light',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 3
                            }}>
                                <ChildCareIcon sx={{ fontSize: 40, color: 'secondary.main' }} />
                            </Box>
                            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                                Postpartum Care
                            </Typography>
                            <Typography sx={{ mb: 4, color: 'text.secondary' }}>
                                Comprehensive guidance for a healthy postpartum recovery
                            </Typography>
                            <Box sx={{ mb: 4 }}>
                                {['Recovery Timeline', 'Lactation Support', 'Mental Health Resources', 'Exercise Guide'].map((feature) => (
                                    <Box key={feature} sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        mb: 2,
                                        color: 'text.secondary'
                                    }}>
                                        <Box sx={{
                                            width: 24,
                                            height: 24,
                                            borderRadius: '50%',
                                            bgcolor: 'secondary.light',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mr: 2
                                        }}>
                                            <CheckIcon sx={{ fontSize: 16, color: 'secondary.main' }} />
                                        </Box>
                                        {feature}
                                    </Box>
                                ))}
                            </Box>
                            <Button
                                variant="contained"
                                color="secondary"
                                size="large"
                                fullWidth
                                onClick={() => {
                                    setActiveMode('postpartum');
                                    setFormData(prev => ({ ...prev, mode: 'postpartum' }));
                                }}
                                sx={{
                                    py: 1.5,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontSize: '1.1rem'
                                }}
                            >
                                Start Your Postpartum Journey
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );

    const renderForm = () => (
        <Container maxWidth="md" sx={{ py: 8 }}>
            <Paper sx={{
                borderRadius: 4,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                overflow: 'hidden'
            }}>
                <Box sx={{
                    p: 4,
                    background: formData.mode === 'pregnancy' ?
                        'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)' :
                        'linear-gradient(135deg, #9C27B0 0%, #6A1B9A 100%)',
                    color: 'white'
                }}>
                    <Typography variant="h4" align="center" sx={{ fontWeight: 700 }}>
                        {formData.mode === 'pregnancy' ? 'Pregnancy Information' : 'Postpartum Information'}
                    </Typography>
                </Box>

                <Box sx={{ p: 4 }}>
                    <Stepper activeStep={activeStep} sx={{ mb: 6 }}>
                        <Step>
                            <StepLabel
                                StepIconProps={{
                                    sx: {
                                        color: activeStep >= 0 ?
                                            (formData.mode === 'pregnancy' ? theme.palette.primary.main : theme.palette.secondary.main) :
                                            theme.palette.text.disabled
                                    }
                                }}
                            >
                                Basic Info
                            </StepLabel>
                        </Step>
                        <Step>
                            <StepLabel
                                StepIconProps={{
                                    sx: {
                                        color: activeStep >= 1 ?
                                            (formData.mode === 'pregnancy' ? theme.palette.primary.main : theme.palette.secondary.main) :
                                            theme.palette.text.disabled
                                    }
                                }}
                            >
                                Health Details
                            </StepLabel>
                        </Step>
                        <Step>
                            <StepLabel
                                StepIconProps={{
                                    sx: {
                                        color: activeStep >= 2 ?
                                            (formData.mode === 'pregnancy' ? theme.palette.primary.main : theme.palette.secondary.main) :
                                            theme.palette.text.disabled
                                    }
                                }}
                            >
                                Complete
                            </StepLabel>
                        </Step>
                    </Stepper>

                    {/* Form content with improved styling */}
                    <Box sx={{ mb: 4 }}>
                        {activeStep === 0 && (
                            <Grid container spacing={3}>
                                {formData.mode === 'pregnancy' ? (
                                    <>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Current Week of Pregnancy"
                                                name="currentWeek"
                                                type="number"
                                                value={formData.currentWeek}
                                                onChange={handleChange}
                                                InputProps={{
                                                    inputProps: { min: 1, max: 40 },
                                                    sx: { borderRadius: theme.shape.borderRadius }
                                                }}
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                select
                                                label="Dietary Preference"
                                                name="dietaryPreference"
                                                value={formData.dietaryPreference}
                                                onChange={handleChange}
                                                variant="outlined"
                                                InputProps={{ sx: { borderRadius: theme.shape.borderRadius } }}
                                            >
                                                <MenuItem value="vegetarian">Vegetarian</MenuItem>
                                                <MenuItem value="non-vegetarian">Non-Vegetarian</MenuItem>
                                                <MenuItem value="vegan">Vegan</MenuItem>
                                            </TextField>
                                        </Grid>
                                    </>
                                ) : (
                                    <>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Weeks Since Delivery"
                                                name="weeksSinceDelivery"
                                                type="number"
                                                value={formData.weeksSinceDelivery}
                                                onChange={handleChange}
                                                InputProps={{
                                                    inputProps: { min: 1, max: 24 },
                                                    sx: { borderRadius: theme.shape.borderRadius }
                                                }}
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                select
                                                label="Delivery Type"
                                                name="deliveryType"
                                                value={formData.deliveryType}
                                                onChange={handleChange}
                                                variant="outlined"
                                                InputProps={{ sx: { borderRadius: theme.shape.borderRadius } }}
                                            >
                                                <MenuItem value="Normal">Normal Delivery</MenuItem>
                                                <MenuItem value="C-Section">C-Section</MenuItem>
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                select
                                                label="Breastfeeding Status"
                                                name="breastfeedingStatus"
                                                value={formData.breastfeedingStatus}
                                                onChange={handleChange}
                                                variant="outlined"
                                                InputProps={{ sx: { borderRadius: theme.shape.borderRadius } }}
                                            >
                                                <MenuItem value="Yes">Yes</MenuItem>
                                                <MenuItem value="No">No</MenuItem>
                                                <MenuItem value="Partial">Partial</MenuItem>
                                            </TextField>
                                        </Grid>
                                    </>
                                )}
                            </Grid>
                        )}

                        {activeStep === 1 && (
                            <Box>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                                    Select any health conditions you have:
                                </Typography>
                                <Grid container spacing={2}>
                                    {['PCOS', 'Thyroid', 'Anemia', 'Diabetes', 'Hypertension', 'None'].map((condition) => (
                                        <Grid item xs={12} sm={6} md={4} key={condition}>
                                            <Card
                                                onClick={() => {
                                                    if (condition === 'None') {
                                                        setFormData(prev => ({ ...prev, healthConditions: [] }));
                                                    } else {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            healthConditions: prev.healthConditions.includes(condition)
                                                                ? prev.healthConditions.filter(hc => hc !== condition)
                                                                : [...prev.healthConditions, condition]
                                                        }));
                                                    }
                                                }}
                                                sx={{
                                                    cursor: 'pointer',
                                                    p: 2,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 2,
                                                    backgroundColor: formData.healthConditions.includes(condition) ?
                                                        (formData.mode === 'pregnancy' ? 'success.light' : 'secondary.light') :
                                                        'background.paper',
                                                    borderRadius: 2,
                                                    transition: 'all 0.2s',
                                                    '&:hover': {
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: 2
                                                    }
                                                }}
                                            >
                                                <Box sx={{
                                                    width: 24,
                                                    height: 24,
                                                    borderRadius: '50%',
                                                    border: '2px solid',
                                                    borderColor: formData.mode === 'pregnancy' ? 'success.main' : 'secondary.main',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    backgroundColor: formData.healthConditions.includes(condition) ?
                                                        (formData.mode === 'pregnancy' ? 'success.main' : 'secondary.main') :
                                                        'transparent'
                                                }}>
                                                    {formData.healthConditions.includes(condition) && (
                                                        <CheckIcon sx={{ fontSize: 16, color: 'white' }} />
                                                    )}
                                                </Box>
                                                <Typography sx={{
                                                    flex: 1,
                                                    color: formData.healthConditions.includes(condition) ?
                                                        (formData.mode === 'pregnancy' ? 'success.dark' : 'secondary.dark') :
                                                        'text.primary'
                                                }}>
                                                    {condition}
                                                </Typography>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        )}

                        {activeStep === 2 && (
                            <Box sx={{ textAlign: 'center' }}>
                                <Box sx={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: '20px',
                                    bgcolor: formData.mode === 'pregnancy' ? 'success.light' : 'secondary.light',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mx: 'auto',
                                    mb: 3
                                }}>
                                    {formData.mode === 'pregnancy' ? (
                                        <PregnantWomanIcon sx={{ fontSize: 40, color: 'success.main' }} />
                                    ) : (
                                        <ChildCareIcon sx={{ fontSize: 40, color: 'secondary.main' }} />
                                    )}
                                </Box>
                                <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                                    Ready to generate your plan
                                </Typography>
                                <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
                                    {formData.mode === 'pregnancy'
                                        ? `We'll create a personalized pregnancy care plan for week ${formData.currentWeek} of your journey.`
                                        : `We'll create a customized postpartum recovery plan for ${formData.weeksSinceDelivery} weeks after delivery.`
                                    }
                                </Typography>
                                <Box sx={{
                                    bgcolor: formData.mode === 'pregnancy' ? 'success.light' : 'secondary.light',
                                    borderRadius: 2,
                                    p: 3,
                                    mb: 4
                                }}>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                        Summary of your information:
                                    </Typography>
                                    <Grid container spacing={2} sx={{ textAlign: 'left' }}>
                                        {formData.mode === 'pregnancy' ? (
                                            <>
                                                <Grid item xs={12} sm={6}>
                                                    <Typography color="text.secondary">Current Week:</Typography>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                        Week {formData.currentWeek}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Typography color="text.secondary">Dietary Preference:</Typography>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                        {formData.dietaryPreference}
                                                    </Typography>
                                                </Grid>
                                            </>
                                        ) : (
                                            <>
                                                <Grid item xs={12} sm={4}>
                                                    <Typography color="text.secondary">Weeks Since Delivery:</Typography>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                        {formData.weeksSinceDelivery} weeks
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={4}>
                                                    <Typography color="text.secondary">Delivery Type:</Typography>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                        {formData.deliveryType}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={4}>
                                                    <Typography color="text.secondary">Breastfeeding:</Typography>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                        {formData.breastfeedingStatus}
                                                    </Typography>
                                                </Grid>
                                            </>
                                        )}
                                        {formData.healthConditions.length > 0 && (
                                            <Grid item xs={12}>
                                                <Typography color="text.secondary">Health Conditions:</Typography>
                                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                                                    {formData.healthConditions.map((condition) => (
                                                        <Chip
                                                            key={condition}
                                                            label={condition}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: 'white',
                                                                fontWeight: 600
                                                            }}
                                                        />
                                                    ))}
                                                </Box>
                                            </Grid>
                                        )}
                                    </Grid>
                                </Box>
                            </Box>
                        )}
                    </Box>

                    {/* Navigation buttons */}
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 2
                    }}>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={handleBack}
                            disabled={activeStep === 0}
                            sx={{
                                px: 4,
                                py: 1.5,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontSize: '1rem',
                                borderColor: formData.mode === 'pregnancy' ? 'success.main' : 'secondary.main',
                                color: formData.mode === 'pregnancy' ? 'success.main' : 'secondary.main',
                            }}
                        >
                            Back
                        </Button>
                        {activeStep === 2 ? (
                            <Button
                                variant="contained"
                                size="large"
                                onClick={handleSubmit}
                                sx={{
                                    px: 4,
                                    py: 1.5,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    bgcolor: formData.mode === 'pregnancy' ? 'success.main' : 'secondary.main',
                                    '&:hover': {
                                        bgcolor: formData.mode === 'pregnancy' ? 'success.dark' : 'secondary.dark',
                                    }
                                }}
                            >
                                Generate Plan
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                size="large"
                                onClick={handleNext}
                                sx={{
                                    px: 4,
                                    py: 1.5,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    bgcolor: formData.mode === 'pregnancy' ? 'success.main' : 'secondary.main',
                                    '&:hover': {
                                        bgcolor: formData.mode === 'pregnancy' ? 'success.dark' : 'secondary.dark',
                                    }
                                }}
                            >
                                Continue
                            </Button>
                        )}
                    </Box>
                </Box>
            </Paper>
        </Container>
    );

    const renderDashboard = () => {
        if (!dashboardData) return null;

        if (dashboardData.type === 'pregnancy') {
            const nutritionData = {
                labels: ['Proteins', 'Vegetables', 'Fruits', 'Grains', 'Dairy'],
                datasets: [
                    {
                        data: [
                            dashboardData.dietPlan.proteins.length,
                            dashboardData.dietPlan.vegetables.length,
                            dashboardData.dietPlan.fruits.length,
                            dashboardData.dietPlan.grains.length,
                            dashboardData.dietPlan.dairy.length,
                        ],
                        backgroundColor: [
                            '#8e44ad',
                            '#16a085',
                            '#f39c12',
                            '#3498db',
                            '#e74c3c',
                        ],
                        borderWidth: 1,
                    },
                ],
            };

            return (
                <Container maxWidth="lg" sx={{ py: 4 }} ref={dashboardRef}>
                    <Box sx={{
                        backgroundColor: theme.palette.background.paper,
                        borderRadius: theme.shape.borderRadius,
                        p: 4,
                        mb: 4,
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: 6,
                            height: '100%',
                            backgroundColor: theme.palette.primary.main
                        }
                    }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
                                Your Pregnancy Dashboard
                            </Typography>
                            <Tooltip title="Print Plan">
                                <IconButton
                                    onClick={() => setOpenPrintDialog(true)}
                                    sx={{
                                        backgroundColor: theme.palette.primary.light + '33',
                                        '&:hover': {
                                            backgroundColor: theme.palette.primary.light + '66'
                                        }
                                    }}
                                >
                                    <PrintIcon sx={{ color: theme.palette.primary.main }} />
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 2,
                            mb: 2
                        }}>
                            <Chip
                                label={`Week ${dashboardData.details.currentWeek}`}
                                color="primary"
                                sx={{ fontWeight: 600 }}
                            />
                            <Chip
                                label={dashboardData.details.dietaryPreference}
                                variant="outlined"
                                sx={{
                                    fontWeight: 600,
                                    borderColor: theme.palette.primary.main,
                                    color: theme.palette.primary.main
                                }}
                            />
                            {dashboardData.details.healthConditions.map((condition, index) => (
                                <Chip
                                    key={index}
                                    label={condition}
                                    sx={{
                                        backgroundColor: theme.palette.warning.light,
                                        color: theme.palette.warning.contrastText,
                                        fontWeight: 600
                                    }}
                                />
                            ))}
                        </Box>
                        <Typography variant="subtitle1" color="text.secondary">
                            Here's your personalized plan for this week of pregnancy
                        </Typography>
                    </Box>

                    <Grid container spacing={3}>
                        <Grid item xs={12} lg={8}>
                            <Card>
                                <CardHeader
                                    title="Weekly Update"
                                    titleTypographyProps={{ variant: 'h5', fontWeight: 600 }}
                                    avatar={
                                        <Avatar sx={{
                                            bgcolor: theme.palette.primary.light,
                                            color: theme.palette.primary.main
                                        }}>
                                            <PregnantWomanIcon />
                                        </Avatar>
                                    }
                                />
                                <CardContent>
                                    <Typography paragraph sx={{ fontSize: '1.1rem' }}>
                                        {dashboardData.tips}
                                    </Typography>

                                    <Accordion sx={{ mt: 2 }}>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                            <Typography sx={{ fontWeight: 600 }}>This Week's Checklist</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <List dense>
                                                {dashboardData.weeklyChecklist.map((item, index) => (
                                                    <ListItem key={index} sx={{ py: 0 }}>
                                                        <ListItemText primary={
                                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <Box sx={{
                                                                    width: 20,
                                                                    height: 20,
                                                                    border: `2px solid ${theme.palette.primary.main}`,
                                                                    borderRadius: '4px',
                                                                    mr: 2,
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center'
                                                                }}></Box>
                                                                {item}
                                                            </Box>
                                                        } />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </AccordionDetails>
                                    </Accordion>
                                </CardContent>
                            </Card>

                            <Card sx={{ mt: 3 }}>
                                <CardHeader
                                    title="Nutrition Plan"
                                    titleTypographyProps={{ variant: 'h5', fontWeight: 600 }}
                                    avatar={
                                        <Avatar sx={{
                                            bgcolor: theme.palette.success.light,
                                            color: theme.palette.success.main
                                        }}>
                                            <NutritionIcon />
                                        </Avatar>
                                    }
                                />
                                <CardContent>
                                    <Grid container spacing={3}>
                                        {Object.entries(dashboardData.dietPlan).map(([category, items]) => (
                                            items.length > 0 && category !== 'specialRecommendations' && (
                                                <Grid item xs={12} sm={6} md={4} key={category}>
                                                    <Paper sx={{
                                                        p: 2,
                                                        height: '100%',
                                                        borderLeft: `4px solid ${category === 'proteins' ? '#8e44ad' :
                                                            category === 'vegetables' ? '#16a085' :
                                                                category === 'fruits' ? '#f39c12' :
                                                                    category === 'grains' ? '#3498db' : '#e74c3c'}`
                                                    }}>
                                                        <Typography variant="subtitle1" sx={{
                                                            textTransform: 'capitalize',
                                                            fontWeight: 600,
                                                            color: theme.palette.text.primary,
                                                            mb: 1
                                                        }}>
                                                            {category}
                                                        </Typography>
                                                        <Divider sx={{ my: 1 }} />
                                                        <List dense>
                                                            {items.map((item, index) => (
                                                                <ListItem key={index} sx={{ py: 0 }}>
                                                                    <ListItemText primary={`• ${item}`} />
                                                                </ListItem>
                                                            ))}
                                                        </List>
                                                    </Paper>
                                                </Grid>
                                            )
                                        ))}
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} lg={4}>
                            <Card sx={{ mb: 3 }}>
                                <CardHeader
                                    title="Nutrition Breakdown"
                                    titleTypographyProps={{ variant: 'h5', fontWeight: 600 }}
                                />
                                <CardContent>
                                    <Box sx={{ height: 300 }}>
                                        <Doughnut
                                            data={nutritionData}
                                            options={{
                                                plugins: {
                                                    legend: {
                                                        position: 'bottom',
                                                        labels: {
                                                            padding: 20,
                                                            usePointStyle: true,
                                                            pointStyle: 'circle'
                                                        }
                                                    }
                                                },
                                                cutout: '70%'
                                            }}
                                        />
                                    </Box>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader
                                    title="Pregnancy Milestones"
                                    titleTypographyProps={{ variant: 'h5', fontWeight: 600 }}
                                />
                                <CardContent>
                                    <List>
                                        {dashboardData.milestones.map((milestone, index) => (
                                            <ListItem key={index} sx={{ py: 1 }}>
                                                <ListItemText
                                                    primary={
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Box sx={{
                                                                width: 24,
                                                                height: 24,
                                                                borderRadius: '50%',
                                                                backgroundColor: milestone.completed ?
                                                                    theme.palette.success.main :
                                                                    theme.palette.grey[300],
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                mr: 2,
                                                                flexShrink: 0
                                                            }}>
                                                                {milestone.completed && (
                                                                    <span style={{ color: '#fff', fontSize: 14 }}>✓</span>
                                                                )}
                                                            </Box>
                                                            <Box>
                                                                <Typography sx={{
                                                                    fontWeight: 600,
                                                                    textDecoration: milestone.completed ? 'line-through' : 'none',
                                                                    opacity: milestone.completed ? 0.7 : 1
                                                                }}>
                                                                    Week {milestone.week}: {milestone.text}
                                                                </Typography>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    {milestone.completed ? 'Completed' : 'Upcoming'}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    }
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {dashboardData.dietPlan.specialRecommendations.length > 0 && (
                        <Card sx={{ mt: 3 }}>
                            <CardHeader
                                title="Special Recommendations"
                                titleTypographyProps={{ variant: 'h5', fontWeight: 600 }}
                                avatar={
                                    <Avatar sx={{
                                        bgcolor: theme.palette.warning.light,
                                        color: theme.palette.warning.main
                                    }}>
                                        <HealthIcon />
                                    </Avatar>
                                }
                            />
                            <CardContent>
                                <List>
                                    {dashboardData.dietPlan.specialRecommendations.map((rec, index) => (
                                        <ListItem key={index}>
                                            <ListItemText primary={
                                                <Box sx={{
                                                    backgroundColor: theme.palette.warning.light + '33',
                                                    borderRadius: theme.shape.borderRadius,
                                                    p: 2,
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}>
                                                    <Box sx={{
                                                        width: 24,
                                                        height: 24,
                                                        borderRadius: '50%',
                                                        backgroundColor: theme.palette.warning.main,
                                                        color: '#fff',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        mr: 2,
                                                        flexShrink: 0
                                                    }}>
                                                        !
                                                    </Box>
                                                    {rec}
                                                </Box>
                                            } />
                                        </ListItem>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    )}

                    <Box sx={{ mt: 4, textAlign: 'center' }}>
                        <Button
                            variant="contained"
                            size="large"
                            sx={{
                                px: 6,
                                backgroundColor: theme.palette.primary.main,
                                '&:hover': {
                                    backgroundColor: theme.palette.primary.dark
                                }
                            }}
                            onClick={() => {
                                setActiveMode(null);
                                setDashboardData(null);
                                setActiveStep(0);
                            }}
                        >
                            Back to Home
                        </Button>
                    </Box>
                </Container>
            );
        } else {
            const recoveryData = {
                labels: ['Hydration', 'Proteins', 'Vegetables', 'Fruits', 'Grains'],
                datasets: [
                    {
                        label: 'Daily Recommendations',
                        data: [
                            dashboardData.nutritionPlan.hydration.length,
                            dashboardData.nutritionPlan.proteins.length,
                            dashboardData.nutritionPlan.vegetables.length,
                            dashboardData.nutritionPlan.fruits.length,
                            dashboardData.nutritionPlan.grains.length,
                        ],
                        backgroundColor: '#16a085',
                    },
                ],
            };

            return (
                <Container maxWidth="lg" sx={{ py: 4 }} ref={dashboardRef}>
                    <Box sx={{
                        backgroundColor: theme.palette.background.paper,
                        borderRadius: theme.shape.borderRadius,
                        p: 4,
                        mb: 4,
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: 6,
                            height: '100%',
                            backgroundColor: theme.palette.secondary.main
                        }
                    }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
                                Your Postpartum Recovery Dashboard
                            </Typography>
                            <Tooltip title="Print Plan">
                                <IconButton
                                    onClick={() => setOpenPrintDialog(true)}
                                    sx={{
                                        backgroundColor: theme.palette.secondary.light + '33',
                                        '&:hover': {
                                            backgroundColor: theme.palette.secondary.light + '66'
                                        }
                                    }}
                                >
                                    <PrintIcon sx={{ color: theme.palette.secondary.main }} />
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 2,
                            mb: 2
                        }}>
                            <Chip
                                label={`Week ${dashboardData.details.weeksSinceDelivery}`}
                                color="secondary"
                                sx={{ fontWeight: 600 }}
                            />
                            <Chip
                                label={dashboardData.details.deliveryType}
                                variant="outlined"
                                sx={{
                                    fontWeight: 600,
                                    borderColor: theme.palette.secondary.main,
                                    color: theme.palette.secondary.main
                                }}
                            />
                            <Chip
                                label={`Breastfeeding: ${dashboardData.details.breastfeedingStatus}`}
                                sx={{
                                    backgroundColor: theme.palette.info.light,
                                    color: theme.palette.info.contrastText,
                                    fontWeight: 600
                                }}
                            />
                        </Box>
                        <Typography variant="subtitle1" color="text.secondary">
                            Here's your personalized recovery plan for this postpartum stage
                        </Typography>
                    </Box>

                    <Grid container spacing={3}>
                        <Grid item xs={12} lg={8}>
                            <Card>
                                <CardHeader
                                    title="Recovery Update"
                                    titleTypographyProps={{ variant: 'h5', fontWeight: 600 }}
                                    avatar={
                                        <Avatar sx={{
                                            bgcolor: theme.palette.secondary.light,
                                            color: theme.palette.secondary.main
                                        }}>
                                            <ChildCareIcon />
                                        </Avatar>
                                    }
                                />
                                <CardContent>
                                    <Typography paragraph sx={{ fontSize: '1.1rem' }}>
                                        {dashboardData.tips}
                                    </Typography>

                                    <Accordion sx={{ mt: 2 }}>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                            <Typography sx={{ fontWeight: 600 }}>Recovery Checklist</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <List dense>
                                                {dashboardData.recoveryChecklist.map((item, index) => (
                                                    <ListItem key={index} sx={{ py: 0 }}>
                                                        <ListItemText primary={
                                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <Box sx={{
                                                                    width: 20,
                                                                    height: 20,
                                                                    border: `2px solid ${theme.palette.secondary.main}`,
                                                                    borderRadius: '4px',
                                                                    mr: 2,
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center'
                                                                }}></Box>
                                                                {item}
                                                            </Box>
                                                        } />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </AccordionDetails>
                                    </Accordion>
                                </CardContent>
                            </Card>

                            <Card sx={{ mt: 3 }}>
                                <CardHeader
                                    title="Nutrition Plan"
                                    titleTypographyProps={{ variant: 'h5', fontWeight: 600 }}
                                    avatar={
                                        <Avatar sx={{
                                            bgcolor: theme.palette.success.light,
                                            color: theme.palette.success.main
                                        }}>
                                            <NutritionIcon />
                                        </Avatar>
                                    }
                                />
                                <CardContent>
                                    <Grid container spacing={3}>
                                        {Object.entries(dashboardData.nutritionPlan).map(([category, items]) => (
                                            items.length > 0 && category !== 'specialRecommendations' && (
                                                <Grid item xs={12} sm={6} md={4} key={category}>
                                                    <Paper sx={{
                                                        p: 2,
                                                        height: '100%',
                                                        borderLeft: `4px solid ${category === 'proteins' ? '#8e44ad' :
                                                            category === 'vegetables' ? '#16a085' :
                                                                category === 'fruits' ? '#f39c12' :
                                                                    category === 'grains' ? '#3498db' :
                                                                        category === 'dairy' ? '#e74c3c' : '#9b59b6'}`
                                                    }}>
                                                        <Typography variant="subtitle1" sx={{
                                                            textTransform: 'capitalize',
                                                            fontWeight: 600,
                                                            color: theme.palette.text.primary,
                                                            mb: 1
                                                        }}>
                                                            {category}
                                                        </Typography>
                                                        <Divider sx={{ my: 1 }} />
                                                        <List dense>
                                                            {items.map((item, index) => (
                                                                <ListItem key={index} sx={{ py: 0 }}>
                                                                    <ListItemText primary={`• ${item}`} />
                                                                </ListItem>
                                                            ))}
                                                        </List>
                                                    </Paper>
                                                </Grid>
                                            )
                                        ))}
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} lg={4}>
                            <Card sx={{ mb: 3 }}>
                                <CardHeader
                                    title="Nutrition Priorities"
                                    titleTypographyProps={{ variant: 'h5', fontWeight: 600 }}
                                />
                                <CardContent>
                                    <Box sx={{ height: 300 }}>
                                        <Bar
                                            data={recoveryData}
                                            options={{
                                                responsive: true,
                                                plugins: {
                                                    legend: {
                                                        position: 'bottom',
                                                        labels: {
                                                            padding: 20,
                                                            usePointStyle: true,
                                                            pointStyle: 'circle'
                                                        }
                                                    }
                                                },
                                                scales: {
                                                    y: {
                                                        beginAtZero: true,
                                                        ticks: {
                                                            stepSize: 1
                                                        }
                                                    }
                                                }
                                            }}
                                        />
                                    </Box>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader
                                    title="Self-Care Tips"
                                    titleTypographyProps={{ variant: 'h5', fontWeight: 600 }}
                                    avatar={
                                        <Avatar sx={{
                                            bgcolor: theme.palette.info.light,
                                            color: theme.palette.info.main
                                        }}>
                                            <SelfCareIcon />
                                        </Avatar>
                                    }
                                />
                                <CardContent>
                                    <List>
                                        <ListItem>
                                            <ListItemText
                                                primary="Rest when baby rests"
                                                secondary="Try to sleep when your baby sleeps to combat fatigue"
                                                sx={{ py: 0.5 }}
                                            />
                                        </ListItem>
                                        <Divider component="li" />
                                        <ListItem>
                                            <ListItemText
                                                primary="Gentle movement"
                                                secondary="Short walks can improve circulation and mood"
                                                sx={{ py: 0.5 }}
                                            />
                                        </ListItem>
                                        <Divider component="li" />
                                        <ListItem>
                                            <ListItemText
                                                primary="Accept help"
                                                secondary="Let others help with chores and meals"
                                                sx={{ py: 0.5 }}
                                            />
                                        </ListItem>
                                        <Divider component="li" />
                                        <ListItem>
                                            <ListItemText
                                                primary="Pelvic floor exercises"
                                                secondary="Start gently and increase as comfortable"
                                                sx={{ py: 0.5 }}
                                            />
                                        </ListItem>
                                    </List>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {dashboardData.nutritionPlan.specialRecommendations.length > 0 && (
                        <Card sx={{ mt: 3 }}>
                            <CardHeader
                                title="Special Recommendations"
                                titleTypographyProps={{ variant: 'h5', fontWeight: 600 }}
                                avatar={
                                    <Avatar sx={{
                                        bgcolor: theme.palette.warning.light,
                                        color: theme.palette.warning.main
                                    }}>
                                        <HealthIcon />
                                    </Avatar>
                                }
                            />
                            <CardContent>
                                <List>
                                    {dashboardData.nutritionPlan.specialRecommendations.map((rec, index) => (
                                        <ListItem key={index}>
                                            <ListItemText primary={
                                                <Box sx={{
                                                    backgroundColor: theme.palette.warning.light + '33',
                                                    borderRadius: theme.shape.borderRadius,
                                                    p: 2,
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}>
                                                    <Box sx={{
                                                        width: 24,
                                                        height: 24,
                                                        borderRadius: '50%',
                                                        backgroundColor: theme.palette.warning.main,
                                                        color: '#fff',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        mr: 2,
                                                        flexShrink: 0
                                                    }}>
                                                        !
                                                    </Box>
                                                    {rec}
                                                </Box>
                                            } />
                                        </ListItem>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    )}

                    <Box sx={{
                        mt: 4,
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 3
                    }}>
                        <Button
                            variant="contained"
                            color="secondary"
                            size="large"
                            sx={{ px: 4 }}
                            onClick={() => setOpenPrintDialog(true)}
                            startIcon={<PrintIcon />}
                        >
                            Print Plan
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            sx={{
                                px: 4,
                                borderColor: theme.palette.secondary.main,
                                color: theme.palette.secondary.main
                            }}
                            onClick={() => {
                                setActiveMode(null);
                                setDashboardData(null);
                                setActiveStep(0);
                            }}
                        >
                            Back to Home
                        </Button>
                    </Box>
                </Container>
            );
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            bgcolor: '#f8fafc', // Light gray background
            pt: { xs: 2, md: 3 }
        }}>
            {/* Print Dialog */}
            <Dialog open={openPrintDialog} onClose={() => setOpenPrintDialog(false)}>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Print Plan</Typography>
                    <IconButton onClick={() => setOpenPrintDialog(false)}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Typography gutterBottom>
                        Ready to print your {dashboardData?.type === 'pregnancy' ? 'pregnancy' : 'postpartum'} plan?
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <PrintIcon sx={{ fontSize: 60, color: theme.palette.primary.main }} />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenPrintDialog(false)}>Cancel</Button>
                    <Button
                        onClick={generatePrint}
                        variant="contained"
                        color="primary"
                        startIcon={<PrintIcon />}
                    >
                        Print
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Main Content */}
            <Box sx={{ pt: 3 }}>
                {!activeMode && renderHome()}
                {activeMode && !dashboardData && renderForm()}
                {dashboardData && renderDashboard()}
            </Box>
        </Box>
    );
};

export default Preg;